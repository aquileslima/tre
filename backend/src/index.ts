import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import path from 'path';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend files
const frontendPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendPath));

// Trello Webhook Verification (HEAD)
app.head('/api/webhook', (req, res) => {
  res.status(200).send();
});

// Trello Webhook Endpoint (POST)
app.post('/api/webhook', async (req, res) => {
  const { action } = req.body;
  if (!action) return res.status(200).send();

  const { type, data, date } = action;

  // We are interested in card movement: "updateCard" with "listBefore" and "listAfter"
  if (type === 'updateCard' && data.listBefore && data.listAfter) {
    const cardId = data.card.id;
    const boardId = data.board.id;
    const listBeforeId = data.listBefore.id;
    const listAfterId = data.listAfter.id;
    const actionDate = new Date(date);

    try {
      // Upsert Board and Card just to make sure they exist
      await prisma.board.upsert({
        where: { id: boardId },
        update: {},
        create: { id: boardId, name: data.board.name }
      });

      await prisma.card.upsert({
        where: { id: cardId },
        update: {},
        create: { id: cardId, boardId, name: data.card.name }
      });

      // Check if listBefore was monitored, if so, close the movement
      const wasMonitored = await prisma.monitoredList.findUnique({ where: { id: listBeforeId } });
      if (wasMonitored) {
        // Find open movement log
        const openLog = await prisma.movementLog.findFirst({
          where: { cardId, listId: listBeforeId, exitedAt: null },
          orderBy: { enteredAt: 'desc' }
        });

        if (openLog) {
          const duration = Math.floor((actionDate.getTime() - openLog.enteredAt.getTime()) / 1000);
          await prisma.movementLog.update({
            where: { id: openLog.id },
            data: { exitedAt: actionDate, duration }
          });
        }
      }

      // Check if listAfter is monitored, if so, open a movement
      const isMonitored = await prisma.monitoredList.findUnique({ where: { id: listAfterId } });
      if (isMonitored) {
        await prisma.movementLog.create({
          data: {
            cardId,
            listId: listAfterId,
            enteredAt: actionDate
          }
        });
      }
    } catch (err) {
      console.error("Error processing webhook:", err);
    }
  }

  res.status(200).send();
});

// API for Dashboard
app.get('/api/dashboard/:boardId', async (req, res) => {
  const { boardId } = req.params;
  
  try {
    const logs = await prisma.movementLog.findMany({
      where: { card: { boardId } },
      include: { card: true }
    });
    
    // Aggregation logic could go here or on frontend
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Catch-all to serve React app for non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
