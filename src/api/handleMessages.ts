import WebSocket from 'ws';
import { registerUser } from './userMessages/reg';
import { createNewRoom } from './userMessages/createNewRoom';
import { addUserToRoom } from './userMessages/addUserToRoom';
import { addShips } from './gameMessages/addShips';

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
  } else if (type === 'add_ships') {
    addShips(socket, data, clientMap);
  } else {
    console.log('else');
  }
};
