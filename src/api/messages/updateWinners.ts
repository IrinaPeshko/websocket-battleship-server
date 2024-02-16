import { getWinners } from '../dataBase';
import WebSocket from 'ws';

export const updateWinners = (socket: WebSocket) => {
  const winners = getWinners();

  const response = {
    type: 'update_winners',
    data: JSON.stringify(winners),
    id: 0,
  };
  socket.send(JSON.stringify(response));
};
