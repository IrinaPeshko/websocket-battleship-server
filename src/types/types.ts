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

// interface IUserInRoom {
//   name: string;
//   index: number;
// }

// interface IUpdateRoomMessage extends IMessage {
//   data: {
//     roomId: number;
//     roomUsers: IUserInRoom[];
//   }[];
// }

export interface IWinner {
  name: string;
  wins: number;
}
// interface IUpdateWinnersMessage extends IMessage {
//   data: IWinner[];
// }
