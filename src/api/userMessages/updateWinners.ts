import { userData } from '../../dataBase/userDB';
import WebSocket from 'ws';

export const updateWinners = (clientMap: Map<WebSocket, number>) => {
  const winners = userData.getWinners();

  const response = {
    type: 'update_winners',
    data: JSON.stringify(winners),
    id: 0,
  };
  clientMap.forEach((_, socket) => {
    socket.send(JSON.stringify(response));
  });
};
