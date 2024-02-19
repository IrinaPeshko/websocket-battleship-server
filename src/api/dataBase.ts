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
  if (rooms.find((room) => room.users[0].index === user.index)) {
    colorConsole.red(
      `The user with index "${user.index}" has already created the room`,
    );
    return false;
  }
  const room: IRoom = {
    roomId: user.index,
    users: [user],
  };
  rooms.push(room);
  return true;
};

const removeUserFromOtherRooms = (user: IUser, rooms: IRoom[]) => {
  rooms.forEach((room, i) => {
    if (
      room.users.find((u) => u.index === user.index) &&
      room.roomId === user.index
    ) {
      rooms.splice(i, 1);
    }
  });
};

export const addToRoom = (user: IUser, indexRoom: number) => {
  const rooms = getRooms();
  const targetRoomIndex = rooms.findIndex((room) => room.roomId === indexRoom);

  if (targetRoomIndex === -1) {
    colorConsole.red(`Error: Room with ID ${indexRoom} does not exist.`);
    return false;
  }

  const targetRoom = rooms[targetRoomIndex];
  if (targetRoom.roomId === user.index) {
    colorConsole.red(
      `Attempt failed: User "${user.name}" (index: ${user.index}) cannot join their own room (Room ID: ${targetRoom.roomId}).`,
    );
    return false;
  }

  removeUserFromOtherRooms(user, rooms);
  targetRoom.users.push(user);
  colorConsole.green(
    `Success: User "${user.name}" (index: ${user.index}) has been successfully added to Room ID: ${targetRoom.roomId}.`,
  );
  return true;
};

export const getPlayers = (id: number) => {
  const rooms = getRooms();
  const currentRoom = rooms.find((room) => room.roomId === id);
  return currentRoom?.users;
};
