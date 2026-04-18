import { useEffect, useState } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const Settings = () => {
  const [lists, setLists] = useState<any[]>([]);
  const [monitored, setMonitored] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    t.lists('all').then((boardLists: any[]) => {
      setLists(boardLists);
      // Aqui faríamos um fetch para o backend para ver quais já estão monitoradas
      setLoading(false);
    });
  }, []);

  const handleToggle = (listId: string) => {
    setMonitored(prev => {
      const next = new Set(prev);
      if (next.has(listId)) next.delete(listId);
      else next.add(listId);
      return next;
    });
    // Call backend to update webhook monitoring
  };

  if (loading) return (
    <div className="p-8 flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-trello-blue"></div>
    </div>
  );

  return (
    <div className="p-6 bg-white min-h-screen text-slate-800">
      <div className="mb-6">
        <h2 className="text-xl font-extrabold mb-1 text-slate-900">Listas Monitoradas</h2>
        <p className="text-sm text-slate-500">Selecione as listas onde o tempo dos cartões será rastreado automaticamente.</p>
      </div>
      
      <div className="space-y-3">
        {lists.map((list) => {
          const isMonitored = monitored.has(list.id);
          return (
            <button 
              key={list.id} 
              onClick={() => handleToggle(list.id)}
              className={`w-full flex items-center justify-between p-4 border rounded-xl shadow-sm transition-all duration-200 ${
                isMonitored ? 'border-trello-blue bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className={`font-semibold text-sm ${isMonitored ? 'text-trello-blue' : 'text-slate-700'}`}>
                {list.name}
              </span>
              {isMonitored ? (
                <CheckCircle2 className="text-trello-blue" size={20} />
              ) : (
                <Circle className="text-slate-300" size={20} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Settings;
