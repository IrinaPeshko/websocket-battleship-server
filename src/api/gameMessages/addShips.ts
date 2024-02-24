import WebSocket from 'ws';
import { gameData } from '../../dataBase/gameDB';
import { colorConsole } from '../../utils/colorConsole';
import { sendShips } from '../../utils/sendShips';
import { sendTurn } from '../../utils/sendTurn';

export const addShips = (
  data: string | object,
  clientMap: Map<WebSocket, number>,
) => {
  const { gameId, ships, indexPlayer } = JSON.parse(data.toString());
  const game = gameData.addShips(gameId, indexPlayer, ships);

  if (game?.player1.ships && game.player2.ships) {
    clientMap.forEach((playerIndex, playerSocket) => {
      if (playerIndex === game.player1.userId && game.player1.ships) {
        sendShips(1, game.player1.ships, playerSocket);
        sendTurn(playerSocket, 1);
      } else if (playerIndex === game.player2.userId && game.player2.ships) {
        sendShips(2, game.player2.ships, playerSocket);
        sendTurn(playerSocket, 1);
      }
    });
    colorConsole.green(
      `Game ID: ${game.gameId} has started. Player ${game.player1.playerId} (User ID: ${game.player1.userId}) and Player ${game.player2.playerId} (User ID: ${game.player2.userId}) have placed their ships and are ready to play.`,
    );
  }
};
