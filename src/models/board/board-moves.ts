import { MBoardRepresentation, MCodeMove, MSquareCode } from './board-representation';
import { MBoard } from './board';
import { MBSPiece, MBSPieceSide, MBSPieceKind } from './board-square';
import { MGameState } from '../game/game-state';

export class MBoardMove {
  public fromPiece: MBSPiece;
  public from: MSquareCode;
  public to: MSquareCode;

  public constructor(other?: Partial<MBoardMove>) {
    this.fromPiece = new MBSPiece(other?.fromPiece);
    this.from = (other?.from !== undefined ? other.from : '');
    this.to = (other?.to !== undefined ? other.to : '');
  }
}

export class MBoardPossibleMove extends MBoardMove {
  public take?: MBSPiece;

  public constructor(other?: Partial<MBoardPossibleMove>) {
    super(other);
    this.take = (other?.take !== undefined ? new MBSPiece(other?.take) : undefined);
  }
}

export class MBoardValidMove extends MBoardPossibleMove {
  public nextBoard: MBoard;
  public nextState: MGameState;

  public constructor(other?: Partial<MBoardValidMove>) {
    super(other);
    this.nextBoard = new MBoard(other?.nextBoard);
    this.nextState = new MGameState(other?.nextState);
  }

  public getAlgebraicNotation(): string {
    const pieceLetter = this.fromPiece.getAlgebraicLetter();
    const fromLetter = this.from[0];
    const take = (this.take !== undefined ? 'x' : '');
    return `${pieceLetter}${fromLetter}${take}${this.to}`;
  }
}

export interface MPossibleMovesArgs {
  from: MSquareCode;
}

interface MPossibleMovesInternalArgs extends MPossibleMovesArgs {
  piece: MBSPiece;
}

export interface MValidMovesArgs {
  from?: MSquareCode;
  possibleMoves?: MBoardPossibleMove[];
}

export namespace MBoardMoves {
  const player2PawnStartingRow = 1;
  const player1PawnStartingRow = 6;

  export function possibleMoves(board: MBoard, args: MPossibleMovesArgs): MBoardPossibleMove[] {
    const fromSquare = board.squareAt(args.from);
    if (fromSquare.piece === undefined) {
      return [];
    }
    const fromPiece = fromSquare.piece;

    let moves: MBoardPossibleMove[] = [];
    switch (fromPiece.kind) {
      case MBSPieceKind.Bishop: moves = possibleMovesBishop(board, { ...args, piece: fromPiece }); break;
      case MBSPieceKind.King: moves = possibleMovesKing(board, { ...args, piece: fromPiece }); break;
      case MBSPieceKind.Knight: moves = possibleMovesKnight(board, { ...args, piece: fromPiece }); break;
      case MBSPieceKind.Pawn: moves = possibleMovesPawn(board, { ...args, piece: fromPiece }); break;
      case MBSPieceKind.Queen: moves = possibleMovesQueen(board, { ...args, piece: fromPiece }); break;
      case MBSPieceKind.Rook: moves = possibleMovesRook(board, { ...args, piece: fromPiece }); break;
    }

    return moves;
  }

  export function validMoves(state: MGameState, board: MBoard, args: MValidMovesArgs): MBoardValidMove[] {
    let possibleMoves: MBoardPossibleMove[] | undefined = args.possibleMoves;
    if (possibleMoves === undefined && args.from !== undefined) {
      possibleMoves = MBoardMoves.possibleMoves(board, { from: args.from });
    }
    if (possibleMoves === undefined) {
      return [];
    }
    const validMoves: MBoardValidMove[] = [];
    for (const possibleMove of possibleMoves) {
      const nextBoard = board.cloneWithMove(possibleMove);
      const nextState = MGameState.createFromBoard(nextBoard);
      const keepMove = (possibleMove.fromPiece.side === MBSPieceSide.Player1 ? !nextState.player1Check : !nextState.player2Check);
      if (keepMove) {
        validMoves.push(new MBoardValidMove({
          ...possibleMove,
          nextBoard: nextBoard,
          nextState: nextState
        }));
      }
    }
    return validMoves;
  }

  function possibleMovesBishop(board: MBoard, args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
    const moves: MBoardPossibleMove[] = [];
    moves.push(...iteratePossibleMoves(board, 1, 1, args)); // top right
    moves.push(...iteratePossibleMoves(board, 1, -1, args)); // bottom right
    moves.push(...iteratePossibleMoves(board, -1, -1, args)); // bottom left
    moves.push(...iteratePossibleMoves(board, -1, 1, args)); // top left
    return moves;
  }

  function possibleMovesKing(board: MBoard, args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
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

  function possibleMovesKnight(board: MBoard, args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
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

  function possibleMovesPawn(board: MBoard, args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
    const moves: MBoardPossibleMove[] = [];

    const codeMove1Ahead = new MCodeMove(0, (args.piece.side === MBSPieceSide.Player1 ? 1 : -1 ));
    const code1Ahead = MBoardRepresentation.codeWithMoveEx(args.from, codeMove1Ahead);
    let piece1Ahead: MBSPiece | undefined;
    if (MBoardRepresentation.isValidCode(code1Ahead)) {
      piece1Ahead = board.squareAtEx(args.from, codeMove1Ahead).piece;
      if (piece1Ahead === undefined) {
        const to = MBoardRepresentation.codeWithMoveEx(args.from, codeMove1Ahead);
        moves.push(new MBoardPossibleMove({
          fromPiece: args.piece,
          from: args.from,
          to: to,
          take: undefined
        }));
      }
    }

    // if pawn is at its initial position, it can then move 2 squares ahead
    const pieceRow = MBoardRepresentation.codeToIndex(board.squareAt(args.from).code).ri;
    let firstMove;
    switch (args.piece.side) {
      case MBSPieceSide.Player1: firstMove = (pieceRow === player1PawnStartingRow); break;
      case MBSPieceSide.Player2: firstMove = (pieceRow === player2PawnStartingRow); break;
    }
    if (firstMove) {
      const codeMove2Ahead = new MCodeMove(0, (args.piece.side === MBSPieceSide.Player1 ? 2 : -2 ));
      const code2Ahead = MBoardRepresentation.codeWithMoveEx(args.from, codeMove2Ahead);
      if (MBoardRepresentation.isValidCode(code2Ahead) &&
          piece1Ahead === undefined && board.squareAtEx(args.from, codeMove2Ahead).piece === undefined) {
        moves.push(new MBoardPossibleMove({
          fromPiece: args.piece,
          from: args.from,
          to: code2Ahead,
          take: undefined
        }));
      }
    }

    const codeMoveTopRight = new MCodeMove((args.piece.side === MBSPieceSide.Player1 ? 1 : -1 ), (args.piece.side === MBSPieceSide.Player1 ? 1 : -1 ));
    const codeTopRight = MBoardRepresentation.codeWithMoveEx(args.from, codeMoveTopRight);
    if (MBoardRepresentation.isValidCode(codeTopRight)) {
      const pieceTopRight = board.squareAtEx(args.from, codeMoveTopRight).piece;
      if (pieceTopRight !== undefined && pieceTopRight.side !== args.piece.side) {
        moves.push(new MBoardPossibleMove({
          fromPiece: args.piece,
          from: args.from,
          to: codeTopRight,
          take: pieceTopRight
        }));
      }
    }

    const codeMoveTopLeft = new MCodeMove((args.piece.side === MBSPieceSide.Player1 ? -1 : 1 ), (args.piece.side === MBSPieceSide.Player1 ? 1 : -1 ));
    const codeTopLeft = MBoardRepresentation.codeWithMoveEx(args.from, codeMoveTopLeft);
    if (MBoardRepresentation.isValidCode(codeTopLeft)) {
      const pieceTopLeft = board.squareAtEx(args.from, codeMoveTopLeft).piece;
      if (pieceTopLeft !== undefined && pieceTopLeft.side !== args.piece.side) {
        moves.push(new MBoardPossibleMove({
          fromPiece: args.piece,
          from: args.from,
          to: codeTopLeft,
          take: pieceTopLeft
        }));
      }
    }

    // TODO: "en passant" move

    return moves;
  }

  function possibleMovesQueen(board: MBoard, args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
    const moves: MBoardPossibleMove[] = [];
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

  function possibleMovesRook(board: MBoard, args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
    const moves: MBoardPossibleMove[] = [];
    moves.push(...iteratePossibleMoves(board, 0, 1, args)); // top
    moves.push(...iteratePossibleMoves(board, 1, 0, args)); // right
    moves.push(...iteratePossibleMoves(board, 0, -1, args)); // bottom
    moves.push(...iteratePossibleMoves(board, -1, 0, args)); // left
    return moves;
  }

  interface MMoveIncrement {
    h: number;
    v: number;
  }

  function getPossibleMoves(board: MBoard, increments: MMoveIncrement[], args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
    const moves: MBoardPossibleMove[] = [];

    for (const increment of increments) {
      const move = new MCodeMove(increment.h, increment.v);
      const nextCode = MBoardRepresentation.codeWithMoveEx(args.from, move);
      if (MBoardRepresentation.isValidCode(nextCode)) {
        const nextSquare = board.squareAtEx(args.from, move);
        if (nextSquare.piece !== undefined) {
          if (nextSquare.piece.side !== args.piece.side) {
            moves.push(new MBoardPossibleMove({
              fromPiece: args.piece,
              from: args.from,
              to: nextCode,
              take: nextSquare.piece
            }));
          }
        } else {
          moves.push(new MBoardPossibleMove({
            fromPiece: args.piece,
            from: args.from,
            to: nextCode,
            take: undefined
          }));
        }
      }
    }

    return moves;
  }

  function iteratePossibleMoves(board: MBoard, incrementHorizontal: number, incrementVertical: number, args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
    const moves: MBoardPossibleMove[] = [];

    const move = new MCodeMove(incrementHorizontal, incrementVertical);
    let nextCode = MBoardRepresentation.codeWithMoveEx(args.from, move);
    while (MBoardRepresentation.isValidCode(nextCode) && board.squareAtEx(args.from, move).piece === undefined) {
      moves.push(new MBoardPossibleMove({
        fromPiece: args.piece,
        from: args.from,
        to: nextCode,
        take: undefined
      }));
      move.cm += incrementHorizontal;
      move.rm += incrementVertical;
      nextCode = MBoardRepresentation.codeWithMoveEx(args.from, move);
    }
    if (MBoardRepresentation.isValidCode(nextCode) &&
        board.squareAtEx(args.from, move).piece !== undefined &&
        board.squareAtEx(args.from, move).piece?.side !== args.piece.side) {
      const to = MBoardRepresentation.codeWithMoveEx(args.from, move);
      moves.push(new MBoardPossibleMove({
        fromPiece: args.piece,
        from: args.from,
        to: to,
        take: board.squareAtEx(args.from, move).piece
      }));
    }

    return moves;
  }
}
