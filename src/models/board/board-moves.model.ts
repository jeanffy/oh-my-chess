import { BoardRepresentationModel, CodeMove, SquareCode } from './board-representation.model';
import { BoardModel } from './board.model';
import { Piece, PieceSide, PieceKind } from '../square.model';

export interface BoardMove {
  fromPiece: Piece;
  from: SquareCode;
  to: SquareCode;
}

export interface BoardPossibleMove extends BoardMove {
  take?: Piece;
}

export interface BoardValidMove extends BoardPossibleMove {
  nextBoard: BoardModel;
}

export interface PossibleMovesArgs {
  from: SquareCode;
}

interface PossibleMovesInternalArgs extends PossibleMovesArgs {
  piece: Piece;
}

export interface ValidMovesArgs {
  from?: SquareCode;
  possibleMoves?: BoardPossibleMove[];
}

export namespace BoardMovesModel {
  const player1PawnStartingRow = 1;
  const player2PawnStartingRow = 6;

  export function possibleMoves(board: BoardModel, args: PossibleMovesArgs): BoardPossibleMove[] {
    const fromSquare = board.squareAt(args.from);
    if (fromSquare.piece === undefined) {
      return [];
    }
    const fromPiece = fromSquare.piece;

    let moves: BoardPossibleMove[] = [];
    switch (fromPiece.kind) {
      case PieceKind.Bishop: moves = possibleMovesBishop(board, { ...args, piece: fromPiece }); break;
      case PieceKind.King: moves = possibleMovesKing(board, { ...args, piece: fromPiece }); break;
      case PieceKind.Knight: moves = possibleMovesKnight(board, { ...args, piece: fromPiece }); break;
      case PieceKind.Pawn: moves = possibleMovesPawn(board, { ...args, piece: fromPiece }); break;
      case PieceKind.Queen: moves = possibleMovesQueen(board, { ...args, piece: fromPiece }); break;
      case PieceKind.Rook: moves = possibleMovesRook(board, { ...args, piece: fromPiece }); break;
    }

    return moves;
  }

  export function validMoves(board: BoardModel, args: ValidMovesArgs): BoardValidMove[] {
    let possibleMoves: BoardPossibleMove[] | undefined = args.possibleMoves;
    if (possibleMoves === undefined && args.from !== undefined) {
      possibleMoves = BoardMovesModel.possibleMoves(board, { from: args.from });
    }
    if (possibleMoves === undefined) {
      return [];
    }
    const validMoves: BoardValidMove[] = [];
    for (const possibleMove of possibleMoves) {
      const nextBoard = board.cloneWithMove(possibleMove);
      nextBoard.updateState();
      const keepMove = (possibleMove.fromPiece.side === PieceSide.Player1 ? !nextBoard.gameState.player1Check : !nextBoard.gameState.player2Check);
      if (keepMove) {
        validMoves.push({ ...possibleMove, nextBoard: nextBoard });
      }
    }
    return validMoves;
  }

  function possibleMovesBishop(board: BoardModel, args: PossibleMovesInternalArgs): BoardPossibleMove[] {
    const moves: BoardPossibleMove[] = [];
    moves.push(...iteratePossibleMoves(board, 1, 1, args)); // top right
    moves.push(...iteratePossibleMoves(board, 1, -1, args)); // bottom right
    moves.push(...iteratePossibleMoves(board, -1, -1, args)); // bottom left
    moves.push(...iteratePossibleMoves(board, -1, 1, args)); // top left
    return moves;
  }

  function possibleMovesKing(board: BoardModel, args: PossibleMovesInternalArgs): BoardPossibleMove[] {
    // TODO: handle castling
    return getPossibleMoves(board, [
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

  function possibleMovesKnight(board: BoardModel, args: PossibleMovesInternalArgs): BoardPossibleMove[] {
    return getPossibleMoves(board, [
      { h: 1, v: 2 },
      { h: 2, v: 1 },
      { h: 2, v: -1 },
      { h: 1, v: -2 },
      { h: -1, v: -2 },
      { h: -2, v: -1 },
      { h: -2, v: 1 },
      { h: -1, v: 2 }
    ], args);
  }

  function possibleMovesPawn(board: BoardModel, args: PossibleMovesInternalArgs): BoardPossibleMove[] {
    const moves: BoardPossibleMove[] = [];

    const codeMove1Ahead = new CodeMove(0, (args.piece.side === PieceSide.Player1 ? 1 : -1 ));
    const code1Ahead = BoardRepresentationModel.codeWithMoveEx(args.from, codeMove1Ahead);
    let piece1Ahead: Piece | undefined;
    if (BoardRepresentationModel.isValidCode(code1Ahead)) {
      piece1Ahead = board.squareAtEx(args.from, codeMove1Ahead).piece;
      if (piece1Ahead === undefined) {
        const to = BoardRepresentationModel.codeWithMoveEx(args.from, codeMove1Ahead);
        moves.push({
          fromPiece: args.piece,
          from: args.from,
          to: to,
          take: undefined
        });
      }
    }

    // if pawn is at its initial position, it can then move 2 squares ahead
    const pieceRow = BoardRepresentationModel.codeToIndex(board.squareAt(args.from).code).ri;
    let firstMove;
    switch (args.piece.side) {
      case PieceSide.Player1: firstMove = (pieceRow === player1PawnStartingRow); break;
      case PieceSide.Player2: firstMove = (pieceRow === player2PawnStartingRow); break;
    }
    if (firstMove) {
      const codeMove2Ahead = new CodeMove(0, (args.piece.side === PieceSide.Player1 ? 2 : -2 ));
      const code2Ahead = BoardRepresentationModel.codeWithMoveEx(args.from, codeMove2Ahead);
      if (BoardRepresentationModel.isValidCode(code2Ahead) &&
          piece1Ahead === undefined && board.squareAtEx(args.from, codeMove2Ahead).piece === undefined) {
        moves.push({
          fromPiece: args.piece,
          from: args.from,
          to: code2Ahead,
          take: undefined
        });
      }
    }

    const codeMoveTopRight = new CodeMove((args.piece.side === PieceSide.Player1 ? 1 : -1 ), (args.piece.side === PieceSide.Player1 ? 1 : -1 ));
    const codeTopRight = BoardRepresentationModel.codeWithMoveEx(args.from, codeMoveTopRight);
    if (BoardRepresentationModel.isValidCode(codeTopRight)) {
      const pieceTopRight = board.squareAtEx(args.from, codeMoveTopRight).piece;
      if (pieceTopRight !== undefined && pieceTopRight.side !== args.piece.side) {
        moves.push({
          fromPiece: args.piece,
          from: args.from,
          to: codeTopRight,
          take: pieceTopRight
        });
      }
    }

    const codeMoveTopLeft = new CodeMove((args.piece.side === PieceSide.Player1 ? -1 : 1 ), (args.piece.side === PieceSide.Player1 ? 1 : -1 ));
    const codeTopLeft = BoardRepresentationModel.codeWithMoveEx(args.from, codeMoveTopLeft);
    if (BoardRepresentationModel.isValidCode(codeTopLeft)) {
      const pieceTopLeft = board.squareAtEx(args.from, codeMoveTopLeft).piece;
      if (pieceTopLeft !== undefined && pieceTopLeft.side !== args.piece.side) {
        moves.push({
          fromPiece: args.piece,
          from: args.from,
          to: codeTopLeft,
          take: pieceTopLeft
        });
      }
    }

    // TODO: "en passant" move

    return moves;
  }

  function possibleMovesQueen(board: BoardModel, args: PossibleMovesInternalArgs): BoardPossibleMove[] {
    const moves: BoardPossibleMove[] = [];
    moves.push(...iteratePossibleMoves(board, 0, 1, args)); // top
    moves.push(...iteratePossibleMoves(board, 1, 1, args)); // top right
    moves.push(...iteratePossibleMoves(board, 1, 0, args)); // right
    moves.push(...iteratePossibleMoves(board, 1, -1, args)); // bottom right
    moves.push(...iteratePossibleMoves(board, 0, -1, args)); // bottom
    moves.push(...iteratePossibleMoves(board, -1, -1, args)); // bottom left
    moves.push(...iteratePossibleMoves(board, -1, 0, args)); // left
    moves.push(...iteratePossibleMoves(board, -1, 1, args)); // top left
    return moves;
  }

  function possibleMovesRook(board: BoardModel, args: PossibleMovesInternalArgs): BoardPossibleMove[] {
    const moves: BoardPossibleMove[] = [];
    moves.push(...iteratePossibleMoves(board, 0, 1, args)); // top
    moves.push(...iteratePossibleMoves(board, 1, 0, args)); // right
    moves.push(...iteratePossibleMoves(board, 0, -1, args)); // bottom
    moves.push(...iteratePossibleMoves(board, -1, 0, args)); // left
    return moves;
  }

  interface MoveIncrement {
    h: number;
    v: number;
  }

  function getPossibleMoves(board: BoardModel, increments: MoveIncrement[], args: PossibleMovesInternalArgs): BoardPossibleMove[] {
    const moves: BoardPossibleMove[] = [];

    for (const increment of increments) {
      const move = new CodeMove(increment.h, increment.v);
      const nextCode = BoardRepresentationModel.codeWithMoveEx(args.from, move);
      if (BoardRepresentationModel.isValidCode(nextCode)) {
        const nextSquare = board.squareAtEx(args.from, move);
        if (nextSquare.piece !== undefined) {
          if (nextSquare.piece.side !== args.piece.side) {
            moves.push({
              fromPiece: args.piece,
              from: args.from,
              to: nextCode,
              take: nextSquare.piece
            });
          }
        } else {
          moves.push({
            fromPiece: args.piece,
            from: args.from,
            to: nextCode,
            take: undefined
          });
        }
      }
    }

    return moves;
  }

  function iteratePossibleMoves(board: BoardModel, incrementHorizontal: number, incrementVertical: number, args: PossibleMovesInternalArgs): BoardPossibleMove[] {
    const moves: BoardPossibleMove[] = [];

    const move = new CodeMove(incrementHorizontal, incrementVertical);
    let nextCode = BoardRepresentationModel.codeWithMoveEx(args.from, move);
    while (BoardRepresentationModel.isValidCode(nextCode) && board.squareAtEx(args.from, move).piece === undefined) {
      moves.push({
        fromPiece: args.piece,
        from: args.from,
        to: nextCode,
        take: undefined
      });
      move.cm += incrementHorizontal;
      move.rm += incrementVertical;
      nextCode = BoardRepresentationModel.codeWithMoveEx(args.from, move);
    }
    if (BoardRepresentationModel.isValidCode(nextCode) &&
        board.squareAtEx(args.from, move).piece !== undefined &&
        board.squareAtEx(args.from, move).piece?.side !== args.piece.side) {
      const to = BoardRepresentationModel.codeWithMoveEx(args.from, move);
      moves.push({
        fromPiece: args.piece,
        from: args.from,
        to: to,
        take: board.squareAtEx(args.from, move).piece
      });
    }

    return moves;
  }
}
