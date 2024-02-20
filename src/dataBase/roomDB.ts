import { IRoom, IUser } from '../types/types';
import { colorConsole } from '../utils/colorConsole';

class RoomData {
  private roomDB: IRoom[] = [];

  constructor() {
    this.roomDB = [];
  }

  private getRooms = () => {
    return this.roomDB;
  };
  private removeUserFromOtherRooms = (user: IUser, rooms: IRoom[]) => {
    rooms.forEach((room, i) => {
      if (
        room.users.find((u) => u.index === user.index) &&
        room.roomId === user.index
      ) {
        rooms.splice(i, 1);
      }
    });
  };

  public getRoomsData = () => {
    const rooms = this.getRooms();
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

  public addNewRoom = (user: IUser) => {
    const rooms = this.getRooms();
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

  public addToRoom = (user: IUser, indexRoom: number) => {
    const rooms = this.getRooms();
    const targetRoomIndex = rooms.findIndex(
      (room) => room.roomId === indexRoom,
    );

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
    this.removeUserFromOtherRooms(user, rooms);
    targetRoom.users.push(user);
    colorConsole.green(
      `Success: User "${user.name}" (index: ${user.index}) has been successfully added to Room ID: ${targetRoom.roomId}.`,
    );
    return true;
  };

  public getPlayers = (id: number) => {
    const rooms = this.getRooms();
    const currentRoom = rooms.find((room) => room.roomId === id);
    return currentRoom?.users;
  };
}

export const roomData = new RoomData();
