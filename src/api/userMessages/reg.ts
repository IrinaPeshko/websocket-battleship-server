import WebSocket from 'ws';
import { IUser } from '../../types/types';
import { getUserIndex } from '../../utils/getUserIndex';
import { updateWinners } from './updateWinners';
import { updateRooms } from './updateRoom';
import { colorConsole } from '../../utils/colorConsole';
import { userData } from '../../dataBase/userDB';

export const registerUser = (
  socket: WebSocket,
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  const { name, password } = JSON.parse(data.toString());

  const isUserRegister = userData.isUserExist(name, password, 'register');
  const isUserLogin = userData.isUserExist(name, password, 'login');

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
      countOfWins: 0,
    };
    userData.addNewUser(newUser, 'login');
    userData.addNewUser(newUser, 'register');
    colorConsole.green(
      `User with name "${name}" and password "${password}" has been registered and logged in.`,
    );
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
      countOfWins: isUserRegister.countOfWins,
    };
    userData.addNewUser(newUser, 'login');
    colorConsole.green(
      `User with name "${name}" and password "${password}" has been logged in.`,
    );
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
  updateWinners(clientMap);
  updateRooms(clientMap);
};
