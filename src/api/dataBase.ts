import { IRoom, IUser, IWinner } from '../types/types';
import { colorConsole } from '../utils/colorConsole';

const usersDB: IUser[] = [];
const loginUserDB: IUser[] = [];
const rooms: IRoom[] = [];

export const getUsers = (type: 'login' | 'register') => {
  return type === 'login' ? loginUserDB : usersDB;
};

export const getUserById = (id: number) => {
  const users = getUsers('register');
  return users.find((user) => user.index === id);
};
export const isUserExist = (
  name: string,
  password: string,
  type: 'login' | 'register',
) => {
  const db = type === 'login' ? getUsers('login') : getUsers('register');
  const existingUser = db.find(
    (u) => u.name === name && u.password === password,
  );
  if (!existingUser) {
    return false;
  }
  if (type === 'login') {
    colorConsole.red(
      `User with name "${name}" and password "${password}" has already login.`,
    );
  }
  return existingUser;
};

export const addNewUser = (user: IUser, type: 'login' | 'register') => {
  const db = type === 'login' ? loginUserDB : usersDB;
  const existingUser = db.find((u) => u.index === user.index);
  if (!existingUser) {
    db.push(user);
    return true;
  }
  colorConsole.red(`User with index "${user.index}" has already exists.`);
  return false;
};

export const deleteUser = (userId: number) => {
  const userIndex = loginUserDB.findIndex((user) => {
    user.index === userId;
  });
  if (userIndex !== -1) {
    colorConsole.red(`User with index "${userId}" is not found.`);
    return false;
  }
  loginUserDB.splice(userIndex, 1);
  return true;
};

export const getWinners = (): IWinner[] => {
  const users = getUsers('register');
  return users
    .filter((user) => user.countOfWins > 0)
    .map((user) => ({
      name: user.name,
      wins: user.countOfWins,
    }));
};

export const getRooms = () => {
  return rooms;
};

export const getRoomsData = () => {
  const rooms = getRooms();
  const data = rooms
    .filter((room) => {
      return room.users.length === 1;
    })
    .map((room) => {
      return {
        roomId: room.roomId,
        roomUsers: room.users.map((user) => ({
          name: user.name,
          index: user.index,
        })),
      };
    });
  return data;
};

export const addNewRoom = (user: IUser) => {
  const rooms = getRooms();
  const room: IRoom = {
    roomId: user.index,
    users: [user],
  };
  rooms.push(room);
};
