import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [boardId, setBoardId] = useState<string | null>(null);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    t.board('id', 'name').then((board: any) => {
      setBoardId(board.id);
    });
  }, []);

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Time Tracker Dashboard</h1>
        <p className="text-slate-500 mt-2">Visão geral do tempo gasto em listas monitoradas.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Total de Cartões</h3>
          <p className="text-3xl font-bold text-slate-800">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Tempo Médio</h3>
          <p className="text-3xl font-bold text-slate-800">4h 30m</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-medium text-slate-500 mb-1">Listas Monitoradas</h3>
          <p className="text-3xl font-bold text-slate-800">3</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[300px]">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Cartões Recentes (Board: {boardId})</h3>
        <p className="text-sm text-slate-500">Gráficos e tabelas com os tempos exatos entrarão aqui.</p>
        {/* Gráficos e tabela serão renderizados aqui, puxando dados do backend */}
      </div>
    </div>
  );
};

export default Dashboard;
