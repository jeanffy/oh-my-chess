import { BoardRepresentationModel, CodeMove, SquareCode } from './board-representation.model';
import { BoardModel, BoardMove } from './board.model';
import { Piece, PieceColor, PieceKind } from './square.model';

export namespace BoardMovesModel {
  export function validMoves(this: BoardModel, from: SquareCode): BoardMove[] {
    const square = this.squareAt(from);
    if (square.piece === undefined) {
      return [];
    }

    switch (square.piece.kind) {
      case PieceKind.Bishop: return validBishopMoves.call(this, from, square.piece);
      case PieceKind.King: return validKingMoves.call(this, from, square.piece);
      case PieceKind.Knight: return validKnightMoves.call(this, from, square.piece);
      case PieceKind.Pawn: return validPawnMoves.call(this, from, square.piece);
      case PieceKind.Queen: return validQueenMoves.call(this, from, square.piece);
      case PieceKind.Rook: return validRookMoves.call(this, from, square.piece);
    }
  }

  function validBishopMoves(this: BoardModel, from: SquareCode, piece: Piece): BoardMove[] {
    const moves: BoardMove[] = [];
    moves.push(...iterateMoves.call(this, from, piece, 1, 1 )); // top right
    moves.push(...iterateMoves.call(this, from, piece, 1, -1)); // bottom right
    moves.push(...iterateMoves.call(this, from, piece, -1, -1)); // bottom left
    moves.push(...iterateMoves.call(this, from, piece, -1, 1)); // top left
    return moves;
  }

  function validKingMoves(this: BoardModel, from: SquareCode, piece: Piece): BoardMove[] {
    return getMoves.call(this, from, piece, [
      { h: 0, v: 1 }, // top
      { h: 1, v: 1 }, // top right
      { h: 1, v: 0 }, // right
      { h: 1, v: -1 }, // bottom right
      { h: 0, v: -1 }, // bottom
      { h: -1, v: -1 }, // bottom left
      { h: -1, v: 0 }, // left
      { h: -1, v: 1 } // top left
    ]);
  }

  function validKnightMoves(this: BoardModel, from: SquareCode, piece: Piece): BoardMove[] {
    return getMoves.call(this, from, piece, [
      { h: 1, v: 2 },
      { h: 2, v: 1 },
      { h: 2, v: -1 },
      { h: 1, v: -2 },
      { h: -1, v: -2 },
      { h: -2, v: 1 },
      { h: -1, v: 2 }
    ]);
  }

  function validPawnMoves(this: BoardModel, from: SquareCode, piece: Piece): BoardMove[] {
    const moves: BoardMove[] = [];

    const codeMove1Ahead = new CodeMove(0, (piece.color === PieceColor.White ? 1 : -1 ));
    const code1Ahead = BoardRepresentationModel.codeWithMoveEx(from, codeMove1Ahead);
    let piece1Ahead: Piece | undefined;
    if (BoardRepresentationModel.isValidCode(code1Ahead)) {
      piece1Ahead = this.squareAtEx(from, codeMove1Ahead).piece;
      if (piece1Ahead === undefined) {
        moves.push({
          from: from,
          to: BoardRepresentationModel.codeWithMoveEx(from, codeMove1Ahead)
        });
      }
    }

    if (piece.firstMove) {
      const codeMove2Ahead = new CodeMove(0, (piece.color === PieceColor.White ? 2 : -2 ));
      const code2Ahead = BoardRepresentationModel.codeWithMoveEx(from, codeMove2Ahead);
      if (BoardRepresentationModel.isValidCode(code2Ahead) &&
          piece1Ahead === undefined && this.squareAtEx(from, codeMove2Ahead).piece === undefined) {
        moves.push({
          from: from,
          to: BoardRepresentationModel.codeWithMoveEx(from, codeMove2Ahead)
        });
      }
    }

    const codeMoveTopRight = new CodeMove((piece.color === PieceColor.White ? 1 : -1 ), (piece.color === PieceColor.White ? 1 : -1 ));
    const codeTopRight = BoardRepresentationModel.codeWithMoveEx(from, codeMoveTopRight);
    if (BoardRepresentationModel.isValidCode(codeTopRight)) {
      const pieceTopRight = this.squareAtEx(from, codeMoveTopRight).piece;
      if (pieceTopRight !== undefined && pieceTopRight.color !== piece.color) {
        moves.push({
          from: from,
          to: BoardRepresentationModel.codeWithMoveEx(from, codeMoveTopRight),
          take: pieceTopRight
        });
      }
    }

    const codeMoveTopLeft = new CodeMove((piece.color === PieceColor.White ? -1 : 1 ), (piece.color === PieceColor.White ? 1 : -1 ));
    const codeTopLeft = BoardRepresentationModel.codeWithMoveEx(from, codeMoveTopLeft);
    if (BoardRepresentationModel.isValidCode(codeTopLeft)) {
      const pieceTopLeft = this.squareAtEx(from, codeMoveTopLeft).piece;
      if (pieceTopLeft !== undefined && pieceTopLeft.color !== piece.color) {
        moves.push({
          from: from,
          to: BoardRepresentationModel.codeWithMoveEx(from, codeMoveTopLeft),
          take: pieceTopLeft
        });
      }
    }

    return moves;
  }

  function validQueenMoves(this: BoardModel, from: SquareCode, piece: Piece): BoardMove[] {
    const moves: BoardMove[] = [];
    moves.push(...iterateMoves.call(this, from, piece, 0, 1)); // top
    moves.push(...iterateMoves.call(this, from, piece, 1, 1)); // top right
    moves.push(...iterateMoves.call(this, from, piece, 1, 0)); // right
    moves.push(...iterateMoves.call(this, from, piece, 1, -1)); // bottom right
    moves.push(...iterateMoves.call(this, from, piece, 0, -1)); // bottom
    moves.push(...iterateMoves.call(this, from, piece, -1, -1)); // bottom left
    moves.push(...iterateMoves.call(this, from, piece, -1, 0)); // left
    moves.push(...iterateMoves.call(this, from, piece, -1, 1)); // top left
    return moves;
  }

  function validRookMoves(this: BoardModel, from: SquareCode, piece: Piece): BoardMove[] {
    const moves: BoardMove[] = [];
    moves.push(...iterateMoves.call(this, from, piece, 0, 1)); // top
    moves.push(...iterateMoves.call(this, from, piece, 1, 0)); // right
    moves.push(...iterateMoves.call(this, from, piece, 0, -1)); // bottom
    moves.push(...iterateMoves.call(this, from, piece, -1, 0)); // left
    return moves;
  }

  interface MoveIncrement {
    h: number;
    v: number;
  }

  function getMoves(this: BoardModel, from: SquareCode, piece: Piece, increments: MoveIncrement[]): BoardMove[] {
    const moves: BoardMove[] = [];

    for (const increment of increments) {
      const move = new CodeMove(increment.h, increment.v);
      const nextCode = BoardRepresentationModel.codeWithMoveEx(from, move);
      if (BoardRepresentationModel.isValidCode(nextCode)) {
        const nextSquare = this.squareAtEx(from, move);
        if (nextSquare.piece !== undefined) {
          if (nextSquare.piece.color !== piece.color) {
            moves.push({ from: from, to: nextCode, take: nextSquare.piece });
          }
        } else {
          moves.push({ from: from, to: nextCode });
        }
      }
    }

    return moves;
  }

  function iterateMoves(this: BoardModel, from: SquareCode, piece: Piece, incrementHorizontal: number, incrementVertical: number): BoardMove[] {
    const moves: BoardMove[] = [];

    const move = new CodeMove(incrementHorizontal, incrementVertical);
    let nextCode = BoardRepresentationModel.codeWithMoveEx(from, move);
    while (BoardRepresentationModel.isValidCode(nextCode) && this.squareAtEx(from, move).piece === undefined) {
      moves.push({
        from: from,
        to: BoardRepresentationModel.codeWithMoveEx(from, move)
      });
      move.cm += incrementHorizontal;
      move.rm += incrementVertical;
      nextCode = BoardRepresentationModel.codeWithMoveEx(from, move);
    }
    if (BoardRepresentationModel.isValidCode(nextCode) && this.squareAtEx(from, move).piece !== undefined && this.squareAtEx(from, move).piece?.color !== piece.color) {
      moves.push({
        from: from,
        to: BoardRepresentationModel.codeWithMoveEx(from, move),
        take: this.squareAtEx(from, move).piece
      });
    }

    return moves;
  }
}
