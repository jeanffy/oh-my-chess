import { MAIPlayerStrategy } from './ai-player-strategy';
import { MGame } from '../game/game';
import { MBoardValidMove } from '../board/board-moves';
import { MBSPieceSide } from '../board/board-square';

export class MAIPlayerStrategyRandom extends MAIPlayerStrategy {
  public constructor(game: MGame) {
    super(game);
  }

  public nextMove(pieceSide: MBSPieceSide): MBoardValidMove | undefined {
    const validMoves =this.game.getAllValidMoves(pieceSide);
    if (validMoves.length === 0) {
      return undefined;
    }
    const m = Math.floor(Math.random() * validMoves.length);
    return validMoves[m];
  }
}
