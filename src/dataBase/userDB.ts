import { IUser, IWinner } from '../types/types';
import { colorConsole } from '../utils/colorConsole';

class UserData {
  private usersDB: IUser[] = [];
  private loginUserDB: IUser[] = [];

  constructor() {
    this.usersDB = [];
    this.loginUserDB = [];
  }

  private getUsers = (type: 'login' | 'register') => {
    return type === 'login' ? this.loginUserDB : this.usersDB;
  };

  public getUserById(id: number) {
    const users = this.getUsers('register');
    return users.find((user) => user.index === id);
  }

  public isUserExist = (
    name: string,
    password: string,
    type: 'login' | 'register',
  ) => {
    const db =
      type === 'login' ? this.getUsers('login') : this.getUsers('register');
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

  public addNewUser = (user: IUser, type: 'login' | 'register') => {
    const db = type === 'login' ? this.loginUserDB : this.usersDB;
    const existingUser = db.find((u) => u.index === user.index);
    if (!existingUser) {
      db.push(user);
      return true;
    }
    colorConsole.red(`User with index "${user.index}" has already exists.`);
    return false;
  };

  public deleteUser = (userId: number) => {
    const userIndex = this.loginUserDB.findIndex((user) => {
      user.index === userId;
    });
    
    if (userIndex !== -1) {
      colorConsole.red(`User with index "${userId}" is not found.`);
      return false;
    }
    this.loginUserDB.splice(userIndex, 1);
    return true;
  };

  getWinners = (): IWinner[] => {
    const users = this.getUsers('register');
    return users
      .filter((user) => user.countOfWins > 0)
      .map((user) => ({
        name: user.name,
        wins: user.countOfWins,
      }));
  };
}

export const userData = new UserData();
