import { BoardModel, BoardMove } from '../board.model';
import { PieceColor, SquareModel } from '../square.model';

export interface PieceWithMoves {
  square: SquareModel;
  validMoves: BoardMove[];
}

export namespace BoardAIPlayerStrategyHelper {
  export function getAllPieces(board: BoardModel, color: PieceColor): SquareModel[] {
    const pieces: SquareModel[] = [];
    board.forEachSquare(square => {
      if (square.piece !== undefined && square.piece.color === color) {
        pieces.push(square);
      }
    });
    return pieces;
  }

  export function getAllPiecesWithValidMoves(board: BoardModel, color: PieceColor): PieceWithMoves[] {
    return BoardAIPlayerStrategyHelper.getAllPieces(board, color)
      .map(p => ({
        square: p,
        validMoves: board.validMoves(p.code)
      }))
      .filter(p => p.validMoves.length > 0);
  }
}
