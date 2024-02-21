import { roomData } from '../../dataBase/roomDB';
import WebSocket from 'ws';

export const updateRooms = (clientMap: Map<WebSocket, number>) => {
  const roomsData = roomData.getRoomsData();
  const response = {
    type: 'update_room',
    data: JSON.stringify(roomsData),
    id: 0,
  };
  clientMap.forEach((_, socket) => {
    socket.send(JSON.stringify(response));
  });
};
