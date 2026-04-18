import { useEffect } from 'react';

declare global {
  interface Window {
    TrelloPowerUp: any;
  }
}

const PowerUp = () => {
  useEffect(() => {
    if (!window.TrelloPowerUp) return;

    window.TrelloPowerUp.initialize({
      'board-buttons': function (t: any, options: any) {
        return [{
          icon: {
            dark: '/vite.svg',
            light: '/vite.svg'
          },
          text: 'Time Tracker Dashboard',
          callback: function (t: any) {
            return t.modal({
              title: 'Time Tracker Dashboard',
              url: '/dashboard',
              fullscreen: true,
            });
          }
        }];
      },
      'show-settings': function (t: any, options: any) {
        return t.popup({
          title: 'Configurações de Monitoramento',
          url: '/settings',
          height: 400,
        });
      },
      'card-badges': function (t: any, options: any) {
        // Here we could fetch from our backend the time spent for this card.
        // Returning a placeholder for now.
        return t.card('id', 'name').then(async (card: any) => {
          return [{
            text: 'Loading...',
            color: 'blue'
          }];
        });
      }
    });
  }, []);

  return null;
};

export default PowerUp;
