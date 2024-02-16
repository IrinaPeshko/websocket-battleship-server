import { IUser } from '../types/types';
import { colorConsole } from '../utils/colorConsole';

const usersDB: IUser[] = [];
const loginUserDB: IUser[] = [];

export const getUsers = (type: 'login' | 'register') => {
  return type === 'login' ? loginUserDB : usersDB;
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
      `User with name ${name} and password ${password} has already login.`,
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
  colorConsole.red(`User with index ${user.index} already exists.`);
  return false;
};

export const deleteUser = (userId: number) => {
  const userIndex = loginUserDB.findIndex((user) => {
    user.index === userId;
  });
  if (userIndex !== -1) {
    colorConsole.red(`User with index ${userId} not found.`);
    return false;
  }
  colorConsole.red(`User with index ${userId} not found.`);
  return false;
};
