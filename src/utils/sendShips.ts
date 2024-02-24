import { IShip } from '../types/types';
import WebSocket from 'ws';

export const sendShips = (
  playerId: number,
  ships: IShip[],
  socket: WebSocket,
) => {
  const data = {
    ships,
    currentPlayerIndex: playerId,
  };

  const response = {
    type: 'start_game',
    data: JSON.stringify(data),
    id: 0,
  };

  socket.send(JSON.stringify(response));
};
