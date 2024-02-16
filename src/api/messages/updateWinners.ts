import { getWinners } from '../dataBase';
import WebSocket from 'ws';

export const updateWinners = (clientMap: Map<WebSocket, number>) => {
  const winners = getWinners();

  const response = {
    type: 'update_winners',
    data: JSON.stringify(winners),
    id: 0,
  };
  clientMap.forEach((_, socket) => {
    socket.send(JSON.stringify(response));
  });
};
