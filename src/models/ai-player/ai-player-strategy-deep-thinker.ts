import { MBoardValidMove } from '../board/board-moves';
import { MGame } from '../game/game';
import { MBSPieceSide } from '../board/board-square';
import { MAIPlayerStrategyRandom } from './ai-player-strategy-random';
import { MAIPlayerStrategy } from './ai-player-strategy';

export class MAIPlayerStrategyDeepThinker extends MAIPlayerStrategy {
  public constructor(game: MGame) {
    super(game);
  }

  public nextMove(pieceSide: MBSPieceSide): MBoardValidMove | undefined {
    const validMoves = this.game.getAllValidMoves(pieceSide);
    if (validMoves.length === 0) {
      return undefined;
    }
    for (const validMove of validMoves) {
      // if (validMove.nextState.)
      // const oppositeSide = (pieceSide === MBSPieceSide.Player1 ? MBSPieceSide.Player2 : MBSPieceSide.Player1);
      // const game = MGame.createWithBoad(validMove.nextBoard, oppositeSide);
      // game.getAllValidMoves
    }
    return new MAIPlayerStrategyRandom(this.game).nextMove(pieceSide);
  }
}
