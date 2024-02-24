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
  gameId: number;
  ships: IShip[];
  indexPlayer: number;
}
type shipType = 'huge' | 'large' | 'medium' | 'small' | 'empty';

export interface ownShip {
  type: shipType;
  isHit: boolean;
  currentShip?: {
    hits: number;
    length: number;
    shipParts: {
      isShot: boolean;
      i: number;
      x: number;
      y: number;
    }[];
  };
}
export interface IShip {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  type: shipType;
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
  gameId: number;
  current: 1 | 2;
  player1: IPlayer;
  player2: IPlayer;
}

export type CellType = 'empty' | 'shot' | 'killed' | 'miss';

interface IPlayer {
  userId: number;
  playerId: number;
  ownBoard: ownShip[][];
  enemyBoard: CellType[][];
  ships?: IShip[];
}
