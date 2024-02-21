import WebSocket from 'ws';
import { gameData } from '../../dataBase/gameDB';

export const finishGame = (
  winID: number,
  socket: WebSocket,
  gameID: number,
) => {
  const response = {
    type: 'finish',
    data: JSON.stringify({
      winPlayer: winID,
    }),
    id: 0,
  };
  socket.send(JSON.stringify(response));

  gameData.deleteGame(gameID);
};
