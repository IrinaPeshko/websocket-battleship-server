import WebSocket from 'ws';
import { registerUser } from './reg';

export const handleMessage = (
  socket: WebSocket,
  type: string,
  name: string,
  password: string,
  clientMap: Map<WebSocket, number>,
) => {
  if (type === 'reg') {
    registerUser(socket, type, name, password, clientMap);
  }
};
