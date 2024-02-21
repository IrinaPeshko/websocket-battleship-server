import WebSocket from 'ws';
import { gameData } from '../../dataBase/gameDB';

export const finishGame = (
  winId: number,
  socket: WebSocket,
  gameId: number,
) => {
  const response = {
    type: 'finish',
    data: JSON.stringify({
      winPlayer: winId,
    }),
    id: 0,
  };
  socket.send(JSON.stringify(response));

  gameData.deleteGame(gameId);
};
