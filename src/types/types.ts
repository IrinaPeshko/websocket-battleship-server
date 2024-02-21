export interface IMessage {
  type: string;
  data: string | object;
  id: number;
}

export interface IReg extends IMessage {
  data: IRegData;
}

interface IRegData {
  name: string;
  password: string;
}

export interface IShipsData extends IMessage {
  data: { gameId: number; ships: IShip[]; indexPlayer: number };
}

interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: 'huge' | 'large' | 'medium' | 'small';
  length: number;
}

export interface IUser {
  index: number;
  name: string;
  password: string;
  countOfWins: number;
}

export interface IRoom {
  roomId: number;
  users: IUser[];
}

export interface IWinner {
  name: string;
  wins: number;
}

export interface IGame {
  gameID: number;
  player1: IPlayer;
  player2: IPlayer;
}

interface IPlayer {
  userId: number;
  playerId: number;
  ships?: IShip[];
}
