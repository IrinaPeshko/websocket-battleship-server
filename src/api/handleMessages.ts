import WebSocket from 'ws';
import { registerUser } from './messages/reg';
import { createNewRoom } from './messages/createNewRoom';

export const handleMessage = (
  socket: WebSocket,
  type: string,
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  if (type === 'reg') {
    registerUser(socket, data, clientMap);
  } else if (type === 'create_room') {
    createNewRoom(socket, clientMap);
  } else {
    console.log('else');
  }
};
