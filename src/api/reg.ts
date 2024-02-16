import WebSocket from 'ws';
import { IUser } from '../types/types';
import { getUserIndex } from '../utils/getUserIndex';
import { addNewUser, isUserExist } from './dataBase';

export const registerUser = (
  socket: WebSocket,
  type: string,
  name: string,
  password: string,
  clientMap: Map<WebSocket, number>,
) => {
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
    const newUser: IUser = {
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
        name: name,
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
        name: name,
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
        name: name,
        index: 1,
        error: true,
        errorText: `Incorrect user data`,
      }),
      id: 0,
    };
  }

  socket.send(JSON.stringify(response));
};
