import { BoardModel, BoardValidMove } from '../board.model';
import { PieceColor } from '../square.model';
import { BoardAIPlayerStrategyModel } from './board-ai-player-strategy.model';

export class BoardAIPlayerStrategyRandomModel extends BoardAIPlayerStrategyModel {
  public constructor(board: BoardModel) {
    super(board);
  }

  public nextMove(color: PieceColor): BoardValidMove | undefined {
    const allPieces = this.board.getAllPiecesWithValidMoves(color, false);
    if (allPieces.length === 0) {
      return undefined;
    }
    const p = Math.floor(Math.random() * allPieces.length);
    const m = Math.floor(Math.random() * allPieces[p].validMoves.length);
    return allPieces[p].validMoves[m];
  }
}
