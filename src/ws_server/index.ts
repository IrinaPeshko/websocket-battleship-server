import WebSocket, { Server } from 'ws';
import { IReg } from '../types/types';
import { getUserIndex } from '../utils/getUserIndex';
import { addNewUser, deleteUser, isUserExist } from '../api/dataBase';
import { colorConsole } from '../utils/colorConsole';

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

      if (type === 'reg') {
        const isUserRegister = isUserExist(name, password, 'register');
        const isUserLogin = isUserExist(name, password, 'login');

        let response: {
          type?: string;
          data?: string;
          id?: number;
        } = {};

        if (!isUserRegister && !isUserLogin) {
          const userIndex = getUserIndex();
          response = {
            type: 'reg',
            data: JSON.stringify({
              name: name,
              index: userIndex,
              error: false,
              errorText: '',
            }),
            id: 0,
          };
          clientMap.set(socket, userIndex);
          const newUser = {
            index: userIndex,
            name: name,
            password: password,
          };
          addNewUser(newUser, 'login');
          addNewUser(newUser, 'register');
        } else if (isUserRegister && !isUserLogin) {
          response = {
            type: 'reg',
            data: JSON.stringify({
              name: message.data.name,
              index: isUserRegister.index,
              error: false,
              errorText: '',
            }),
            id: 0,
          };
          clientMap.set(socket, isUserRegister.index);
          const newUser = {
            index: isUserRegister.index,
            name: name,
            password: password,
          };
          addNewUser(newUser, 'login');
        } else if (isUserRegister && isUserLogin) {
          response = {
            type: 'reg',
            data: JSON.stringify({
              name: message.data.name,
              index: isUserRegister.index,
              error: true,
              errorText: `The user with index ${isUserRegister.index} is already login`,
            }),
            id: 0,
          };
        } else {
          response = {
            type: 'reg',
            data: JSON.stringify({
              name: message.data.name,
              index: 1,
              error: true,
              errorText: `Incorrect user data`,
            }),
            id: 0,
          };
        }

        socket.send(JSON.stringify(response));
      }
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
