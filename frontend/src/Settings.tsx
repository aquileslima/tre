import { useEffect, useState } from 'react';

const Settings = () => {
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.TrelloPowerUp.iframe();
    t.lists('all').then((boardLists: any[]) => {
      setLists(boardLists);
      setLoading(false);
    });
  }, []);

  const handleToggle = async (listId: string, name: string) => {
    // In a real app, you would send this to the backend to create the webhook
    console.log('Toggling list:', listId, name);
  };

  if (loading) return <div className="p-4">Carregando listas...</div>;

  return (
    <div className="p-4 bg-white min-h-screen text-slate-800">
      <h2 className="text-lg font-bold mb-4 text-trello-blue">Listas Monitoradas</h2>
      <p className="text-sm text-slate-600 mb-4">Selecione as listas onde o tempo dos cartões será monitorado.</p>
      
      <div className="space-y-2">
        {lists.map((list) => (
          <div key={list.id} className="flex items-center justify-between p-3 border rounded-md shadow-sm">
            <span className="font-medium text-sm">{list.name}</span>
            <button 
              onClick={() => handleToggle(list.id, list.name)}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded"
            >
              Monitorar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
