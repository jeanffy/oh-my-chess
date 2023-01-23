import { MAIPlayerStrategy as MAIPlayerStrategy } from './ai-player-strategy';
import { MGame } from '../game/game';
import { MBoardMoves, MBoardValidMove } from '../board/board-moves';
import { MBSPieceSide } from '../board/board-square';

export class MAIPlayerStrategyRandom extends MAIPlayerStrategy {
  public constructor(game: MGame) {
    super(game);
  }

  public nextMove(pieceSide: MBSPieceSide): MBoardValidMove | undefined {
    const allPossibleMoves = this.game.board.getAllPiecesWithPossibleMoves(pieceSide).flatMap(p => p.possibleMoves);
    if (allPossibleMoves.length === 0) {
      return undefined;
    }
    const allValidMoves = MBoardMoves.validMoves(this.game.state, this.game.board, { possibleMoves: allPossibleMoves });
    const m = Math.floor(Math.random() * allValidMoves.length);
    return allValidMoves[m];
  }
}
