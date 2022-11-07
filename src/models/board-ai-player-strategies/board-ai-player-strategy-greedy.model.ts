import { BoardModel, BoardMove } from '../board.model';
import { PieceColor } from '../square.model';
import { BoardAIPlayerStrategyRandomModel } from './board-ai-player-strategy-random.model';
import { BoardAIPlayerStrategyHelper } from './board-ai-player-strategy.helper';
import { BoardAIPlayerStrategyModel } from './board-ai-player-strategy.model';

export class BoardAIPlayerStrategyGreedyModel extends BoardAIPlayerStrategyModel {
  public constructor(board: BoardModel) {
    super(board);
  }

  public nextMove(color: PieceColor): BoardMove | undefined {
    const allPieces = BoardAIPlayerStrategyHelper.getAllPiecesWithValidMoves(this.board, color);
    if (allPieces.length === 0) {
      return undefined;
    }
    // among all moves that take a piece, find the one which takes the highest piece
    let higherStrength = Number.MIN_SAFE_INTEGER;
    let highestMove: BoardMove | undefined;
    allPieces.forEach(p => {
      p.validMoves.forEach(m => {
        if (m.take !== undefined && m.take.strength > higherStrength) {
          higherStrength = m.take.strength;
          highestMove = m;
        }
      });
    });
    if (highestMove !== undefined) {
      return highestMove;
    }
    // if no move take a piece, just use random strategy as a fallback
    return new BoardAIPlayerStrategyRandomModel(this.board).nextMove(color);
  }
}
