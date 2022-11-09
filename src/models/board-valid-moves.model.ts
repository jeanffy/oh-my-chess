import { BoardRepresentationModel, CodeMove, SquareCode } from './board-representation.model';
import { BoardModel, BoardValidMove } from './board.model';
import { Piece, PieceColor, PieceKind } from './square.model';

export interface ValidMovesArgs {
  from: SquareCode;
  computeNextBoard: boolean;
}

interface ValidMovesInternalArgs extends ValidMovesArgs {
  piece: Piece;
}

export namespace BoardValidMovesModel {
  export function validMoves(this: BoardModel, args: ValidMovesArgs): BoardValidMove[] {
    const fromSquare = this.squareAt(args.from);
    if (fromSquare.piece === undefined) {
      return [];
    }
    const fromPiece = fromSquare.piece;

    let moves: BoardValidMove[] = [];
    switch (fromPiece.kind) {
      case PieceKind.Bishop: moves = validBishopMoves.call(this, { ...args, piece: fromPiece }); break;
      case PieceKind.King: moves = validKingMoves.call(this, { ...args, piece: fromPiece }); break;
      case PieceKind.Knight: moves = validKnightMoves.call(this, { ...args, piece: fromPiece }); break;
      case PieceKind.Pawn: moves = validPawnMoves.call(this, { ...args, piece: fromPiece }); break;
      case PieceKind.Queen: moves = validQueenMoves.call(this, { ...args, piece: fromPiece }); break;
      case PieceKind.Rook: moves = validRookMoves.call(this, { ...args, piece: fromPiece }); break;
    }

    switch (fromPiece.color) {
      case PieceColor.White: moves = moves.filter(m => !m.nextBoard.gameState.whiteCheck); break;
      case PieceColor.Black: moves = moves.filter(m => !m.nextBoard.gameState.blackCheck); break;
    }

    return moves;
  }

  function validBishopMoves(this: BoardModel, args: ValidMovesInternalArgs): BoardValidMove[] {
    const moves: BoardValidMove[] = [];
    moves.push(...iterateMoves.call(this, 1, 1, args)); // top right
    moves.push(...iterateMoves.call(this, 1, -1, args)); // bottom right
    moves.push(...iterateMoves.call(this, -1, -1, args)); // bottom left
    moves.push(...iterateMoves.call(this, -1, 1, args)); // top left
    return moves;
  }

  function validKingMoves(this: BoardModel, args: ValidMovesInternalArgs): BoardValidMove[] {
    // TODO: handle castling
    return getMoves.call(this, [
      { h: 0, v: 1 }, // top
      { h: 1, v: 1 }, // top right
      { h: 1, v: 0 }, // right
      { h: 1, v: -1 }, // bottom right
      { h: 0, v: -1 }, // bottom
      { h: -1, v: -1 }, // bottom left
      { h: -1, v: 0 }, // left
      { h: -1, v: 1 } // top left
    ], args);
  }

  function validKnightMoves(this: BoardModel, args: ValidMovesInternalArgs): BoardValidMove[] {
    return getMoves.call(this, [
      { h: 1, v: 2 },
      { h: 2, v: 1 },
      { h: 2, v: -1 },
      { h: 1, v: -2 },
      { h: -1, v: -2 },
      { h: -2, v: 1 },
      { h: -1, v: 2 }
    ], args);
  }

  function validPawnMoves(this: BoardModel, args: ValidMovesInternalArgs): BoardValidMove[] {
    const moves: BoardValidMove[] = [];

    const codeMove1Ahead = new CodeMove(0, (args.piece.color === PieceColor.White ? 1 : -1 ));
    const code1Ahead = BoardRepresentationModel.codeWithMoveEx(args.from, codeMove1Ahead);
    let piece1Ahead: Piece | undefined;
    if (BoardRepresentationModel.isValidCode(code1Ahead)) {
      piece1Ahead = this.squareAtEx(args.from, codeMove1Ahead).piece;
      if (piece1Ahead === undefined) {
        const to = BoardRepresentationModel.codeWithMoveEx(args.from, codeMove1Ahead);
        moves.push({
          from: args.from,
          to: to,
          take: undefined,
          nextBoard: (args.computeNextBoard ? this.cloneWithMove({ from: args.from, to: to }) : this)
        });
      }
    }

    if (args.piece.firstMove) {
      const codeMove2Ahead = new CodeMove(0, (args.piece.color === PieceColor.White ? 2 : -2 ));
      const code2Ahead = BoardRepresentationModel.codeWithMoveEx(args.from, codeMove2Ahead);
      if (BoardRepresentationModel.isValidCode(code2Ahead) &&
          piece1Ahead === undefined && this.squareAtEx(args.from, codeMove2Ahead).piece === undefined) {
        const to = BoardRepresentationModel.codeWithMoveEx(args.from, codeMove2Ahead);
        moves.push({
          from: args.from,
          to: to,
          take: undefined,
          nextBoard: (args.computeNextBoard ? this.cloneWithMove({ from: args.from, to: to }) : this)
        });
      }
    }

    const codeMoveTopRight = new CodeMove((args.piece.color === PieceColor.White ? 1 : -1 ), (args.piece.color === PieceColor.White ? 1 : -1 ));
    const codeTopRight = BoardRepresentationModel.codeWithMoveEx(args.from, codeMoveTopRight);
    if (BoardRepresentationModel.isValidCode(codeTopRight)) {
      const pieceTopRight = this.squareAtEx(args.from, codeMoveTopRight).piece;
      if (pieceTopRight !== undefined && pieceTopRight.color !== args.piece.color) {
        const to = BoardRepresentationModel.codeWithMoveEx(args.from, codeMoveTopRight);
        moves.push({
          from: args.from,
          to: BoardRepresentationModel.codeWithMoveEx(args.from, codeMoveTopRight),
          take: pieceTopRight,
          nextBoard: (args.computeNextBoard ? this.cloneWithMove({ from: args.from, to: to }) : this)
        });
      }
    }

    const codeMoveTopLeft = new CodeMove((args.piece.color === PieceColor.White ? -1 : 1 ), (args.piece.color === PieceColor.White ? 1 : -1 ));
    const codeTopLeft = BoardRepresentationModel.codeWithMoveEx(args.from, codeMoveTopLeft);
    if (BoardRepresentationModel.isValidCode(codeTopLeft)) {
      const pieceTopLeft = this.squareAtEx(args.from, codeMoveTopLeft).piece;
      if (pieceTopLeft !== undefined && pieceTopLeft.color !== args.piece.color) {
        const to = BoardRepresentationModel.codeWithMoveEx(args.from, codeMoveTopLeft);
        moves.push({
          from: args.from,
          to: to,
          take: pieceTopLeft,
          nextBoard: (args.computeNextBoard ? this.cloneWithMove({ from: args.from, to: to }) : this)
        });
      }
    }

    // TODO: "en passant" move

    return moves;
  }

  function validQueenMoves(this: BoardModel, args: ValidMovesInternalArgs): BoardValidMove[] {
    const moves: BoardValidMove[] = [];
    moves.push(...iterateMoves.call(this, 0, 1, args)); // top
    moves.push(...iterateMoves.call(this, 1, 1, args)); // top right
    moves.push(...iterateMoves.call(this, 1, 0, args)); // right
    moves.push(...iterateMoves.call(this, 1, -1, args)); // bottom right
    moves.push(...iterateMoves.call(this, 0, -1, args)); // bottom
    moves.push(...iterateMoves.call(this, -1, -1, args)); // bottom left
    moves.push(...iterateMoves.call(this, -1, 0, args)); // left
    moves.push(...iterateMoves.call(this, -1, 1, args)); // top left
    return moves;
  }

  function validRookMoves(this: BoardModel, args: ValidMovesInternalArgs): BoardValidMove[] {
    const moves: BoardValidMove[] = [];
    moves.push(...iterateMoves.call(this, 0, 1, args)); // top
    moves.push(...iterateMoves.call(this, 1, 0, args)); // right
    moves.push(...iterateMoves.call(this, 0, -1, args)); // bottom
    moves.push(...iterateMoves.call(this, -1, 0, args)); // left
    return moves;
  }

  interface MoveIncrement {
    h: number;
    v: number;
  }

  function getMoves(this: BoardModel, increments: MoveIncrement[], args: ValidMovesInternalArgs): BoardValidMove[] {
    const moves: BoardValidMove[] = [];

    for (const increment of increments) {
      const move = new CodeMove(increment.h, increment.v);
      const nextCode = BoardRepresentationModel.codeWithMoveEx(args.from, move);
      if (BoardRepresentationModel.isValidCode(nextCode)) {
        const nextSquare = this.squareAtEx(args.from, move);
        if (nextSquare.piece !== undefined) {
          if (nextSquare.piece.color !== args.piece.color) {
            moves.push({
              from: args.from,
              to: nextCode,
              take: nextSquare.piece,
              nextBoard: (args.computeNextBoard ? this.cloneWithMove({ from: args.from, to: nextCode }): this)
            });
          }
        } else {
          moves.push({
            from: args.from,
            to: nextCode,
            take: undefined,
            nextBoard: (args.computeNextBoard ? this.cloneWithMove({ from: args.from, to: nextCode }): this)
          });
        }
      }
    }

    return moves;
  }

  function iterateMoves(this: BoardModel, incrementHorizontal: number, incrementVertical: number, args: ValidMovesInternalArgs): BoardValidMove[] {
    const moves: BoardValidMove[] = [];

    const move = new CodeMove(incrementHorizontal, incrementVertical);
    let nextCode = BoardRepresentationModel.codeWithMoveEx(args.from, move);
    while (BoardRepresentationModel.isValidCode(nextCode) && this.squareAtEx(args.from, move).piece === undefined) {
      moves.push({
        from: args.from,
        to: nextCode,
        take: undefined,
        nextBoard: (args.computeNextBoard ? this.cloneWithMove({ from: args.from, to: nextCode }) : this)
      });
      move.cm += incrementHorizontal;
      move.rm += incrementVertical;
      nextCode = BoardRepresentationModel.codeWithMoveEx(args.from, move);
    }
    if (BoardRepresentationModel.isValidCode(nextCode) &&
        this.squareAtEx(args.from, move).piece !== undefined &&
        this.squareAtEx(args.from, move).piece?.color !== args.piece.color) {
      const to = BoardRepresentationModel.codeWithMoveEx(args.from, move);
      moves.push({
        from: args.from,
        to: to,
        take: this.squareAtEx(args.from, move).piece,
        nextBoard: (args.computeNextBoard ? this.cloneWithMove({ from: args.from, to: to }) : this)
      });
    }

    return moves;
  }
}
