import WebSocket from 'ws';
import { createNewRoom } from '../userMessages/createNewRoom';
import { sendCreateGame } from '../../utils/sendResponses';
import { colorConsole } from '../../utils/colorConsole';
import { roomData } from '../../dataBase/roomDB';
import { updateRooms } from '../userMessages/updateRoom';
import { IShip, IUser } from '../../types/types';
import { getRandomElement } from '../../utils/getRandomElement';
import { gameData } from '../../dataBase/gameDB';
import { shipsVariants } from '../../utils/shipsVariants';

export const createSinglePLay = (
  socket: WebSocket,
  clientMap: Map<WebSocket, number>,
) => {
  const bot: IUser = {
    name: 'bot',
    password: 'bot',
    countOfWins: 0,
    index: NaN,
  };
  const userId = clientMap.get(socket);
  if (!userId) {
    colorConsole.red(`The user is not found`);
    return;
  }

  createNewRoom(socket, clientMap);
  roomData.addToRoom(bot, userId);
  updateRooms(clientMap);
  gameData.createGame(userId, userId, bot.index);
  sendCreateGame(userId, 1, socket);
  const randomShips: IShip[] = getRandomElement(shipsVariants);
  gameData.addShips(userId, 2, randomShips);
};
