interface IMessage {
  type: string;
  data: object;
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
}
