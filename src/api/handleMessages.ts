import WebSocket from 'ws';
import { registerUser } from './userMessages/reg';
import { createNewRoom } from './userMessages/createNewRoom';
import { addUserToRoom } from './userMessages/addUserToRoom';
import { addShips } from './gameMessages/addShips';
import { getAttack } from './gameMessages/getAttack';
import { getRandomAttack } from './gameMessages/getRandomAttack';
import { createSinglePLay } from './gameMessages/createSinglePLay';

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
    addShips(data, clientMap);
  } else if (type === 'attack') {
    getAttack(data, clientMap);
  } else if (type === 'randomAttack') {
    getRandomAttack(data, clientMap);
  } else if (type === 'single_play') {
    createSinglePLay(socket, clientMap);
  } else {
    console.log(`Received unhandled message type: '${type}' with data:`, data);
  }
};
