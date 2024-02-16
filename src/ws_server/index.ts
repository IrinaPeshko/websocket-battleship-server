import WebSocket, { Server } from 'ws';
import { IReg } from '../types/types';
import { deleteUser } from '../api/dataBase';
import { colorConsole } from '../utils/colorConsole';
import { handleMessage } from '../api/handleMessages';

export const startWebSocket = () => {
  const PORT = 3000;
  const wss = new Server({ port: PORT }, () => {
    colorConsole.green('WebSocket server started on ws://127.0.0.1:3000');
  });
  const clientMap = new Map<WebSocket, number>();
  wss.on('connection', (socket: WebSocket) => {
    colorConsole.blue(`New client connected`);

    socket.on('message', (messageData: WebSocket.RawData) => {
      const message: IReg = JSON.parse(messageData.toString());
      console.log('Parsed message from client:', message);

      const { type, data } = message;
      const { name, password } = JSON.parse(data.toString());
      console.log(`Name: ${name}, Password: ${password}`);

      handleMessage(socket, type, name, password, clientMap);
    });

    socket.on('close', () => {
      const userIndex = clientMap.get(socket);
      if (userIndex !== undefined) {
        deleteUser(userIndex);
        clientMap.delete(socket);
      }
      colorConsole.blue(`Client with index ${userIndex} disconnected`);
    });
  });
};
