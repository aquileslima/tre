import { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Clock, Users, Tags, Filter } from 'lucide-react';

const Dashboard = () => {
  const [boardId, setBoardId] = useState<string | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      if (!window.TrelloPowerUp) return;
      const t = window.TrelloPowerUp.iframe();
      
      try {
        const board = await t.board('id', 'name');
        setBoardId(board.id);

        // Fetch cards from Trello
        const trelloCards = await t.cards('id', 'name', 'labels', 'members');
        setCards(trelloCards);

        // Mock backend call (Replace with actual fetch when backend is connected)
        // const response = await fetch(`/api/dashboard/${board.id}`);
        // const movementLogs = await response.json();
        
        // MOCK DATA for now
        const mockLogs = [
          { cardId: trelloCards[0]?.id, duration: 12000, listId: 'list1' }, // 12000s = 3.3h
          { cardId: trelloCards[1]?.id, duration: 5400, listId: 'list1' },  // 5400s = 1.5h
          { cardId: trelloCards[2]?.id, duration: 86400, listId: 'list2' }, // 86400s = 24h
        ];
        setLogs(mockLogs);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  // Merge Data
  const chartData = useMemo(() => {
    return cards.map(card => {
      const cardLogs = logs.filter(log => log.cardId === card.id);
      const totalTimeSeconds = cardLogs.reduce((acc, curr) => acc + (curr.duration || 0), 0);
      const totalHours = Number((totalTimeSeconds / 3600).toFixed(1));
      
      return {
        name: card.name,
        time: totalHours,
        labels: card.labels || [],
        members: card.members || []
      };
    }).filter(d => d.time > 0); // Only show cards that have tracked time
  }, [cards, logs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trello-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Time Tracker Dashboard</h1>
          <p className="text-slate-500 mt-2">Análise de tempo gasto nas listas monitoradas.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
          <Filter size={16} />
          Filtros
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-trello-blue rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500">Tempo Total</h3>
            <p className="text-2xl font-bold text-slate-800">
              {chartData.reduce((acc, curr) => acc + curr.time, 0).toFixed(1)}h
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Tags size={24} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500">Cartões Rastreados</h3>
            <p className="text-2xl font-bold text-slate-800">{chartData.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500">Membros Ativos</h3>
            <p className="text-2xl font-bold text-slate-800">
              {new Set(chartData.flatMap(c => c.members.map((m: any) => m.id))).size}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Tempo por Cartão (Horas)</h3>
          <div className="h-[350px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="time" fill="#0079bf" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                Nenhum dado de tempo registrado ainda.
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Detalhamento</h3>
          <div className="space-y-4">
            {chartData.map((card, idx) => (
              <div key={idx} className="flex flex-col p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-slate-700 text-sm">{card.name}</span>
                  <span className="font-bold text-trello-blue text-sm">{card.time}h</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {card.labels.map((label: any, i: number) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-bold rounded" style={{ backgroundColor: label.color || '#e2e8f0', color: label.color ? '#fff' : '#475569' }}>
                      {label.name || 'Label'}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
