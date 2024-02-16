import WebSocket, { Server } from 'ws';
import { IMessage } from '../types/types';
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
      const message: IMessage = JSON.parse(messageData.toString());
      console.log('Parsed message from client:', message);

      const { type, data } = message;

      handleMessage(socket, type, data, clientMap);
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
