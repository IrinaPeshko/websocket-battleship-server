import { getRoomsData } from '../dataBase';
import WebSocket from 'ws';

export const updateRooms = (socket: WebSocket) => {
  const roomsData = getRoomsData();
  const response = {
    type: 'update_room',
    data: JSON.stringify(roomsData),
    id: 0,
  };
  socket.send(JSON.stringify(response));
};
