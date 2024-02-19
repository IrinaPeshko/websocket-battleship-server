import WebSocket from 'ws';
import { registerUser } from './messages/reg';
import { createNewRoom } from './messages/createNewRoom';
import { addUserToRoom } from './messages/addUserToRoom';

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
  } else if (type === 'add_user_to_room') {
    addUserToRoom(socket, data, clientMap);
  } else {
    console.log('else');
  }
};
