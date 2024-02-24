import WebSocket from 'ws';
export const sendTurn = (socket: WebSocket, currentPlayer: 1 | 2) => {
  const response = {
    type: 'turn',
    data: JSON.stringify({ currentPlayer }),
    id: 0,
  };
  socket.send(JSON.stringify(response));
};
