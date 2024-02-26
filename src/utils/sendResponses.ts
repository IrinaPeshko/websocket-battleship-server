import WebSocket from 'ws';
import { IShip } from '../types/types';

export const sendTurn = (socket: WebSocket, currentPlayer: 1 | 2) => {
  const response = {
    type: 'turn',
    data: JSON.stringify({ currentPlayer }),
    id: 0,
  };
  socket.send(JSON.stringify(response));
};

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

export const sendCreateGame = (
  roomId: number,
  userId: number,
  socket: WebSocket,
) => {
  const data = JSON.stringify({
    idGame: roomId,
    idPlayer: userId,
  });
  const response = {
    type: 'create_game',
    data,
    id: 0,
  };
  socket.send(JSON.stringify(response));
};
