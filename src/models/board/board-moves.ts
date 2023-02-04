import * as boardRepresentation from './board-representation';
import { MBoard } from './board';
import { MBSPiece, MBSPieceSide, MBSPieceKind } from './board-square';
import { MGameState } from '../game/game-state';

export class MBoardMove {
  public fromPiece: MBSPiece;
  public from: boardRepresentation.MSquareCode;
  public to: boardRepresentation.MSquareCode;

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
  from: boardRepresentation.MSquareCode;
}

interface MPossibleMovesInternalArgs extends MPossibleMovesArgs {
  piece: MBSPiece;
}

export interface MValidMovesArgs {
  from?: boardRepresentation.MSquareCode;
  possibleMoves?: MBoardPossibleMove[];
}

const player1PawnEnPassantRow = 5;
const player2PawnEnPassantRow = 4;

export function computePossibleMoves(board: MBoard, args: MPossibleMovesArgs): MBoardPossibleMove[] {
  const fromSquare = board.squareAt(args.from);
  if (fromSquare?.piece === undefined) {
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

export function computeValidMoves(state: MGameState, board: MBoard, args: MValidMovesArgs): MBoardValidMove[] {
  let possibleMoves: MBoardPossibleMove[] | undefined = args.possibleMoves;
  if (possibleMoves === undefined && args.from !== undefined) {
    possibleMoves = computePossibleMoves(board, { from: args.from });
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

  const pieceRow = boardRepresentation.extractRow(args.from);

  const code1Ahead = boardRepresentation.codeWithMove(args.from, 0, (args.piece.side === MBSPieceSide.Player1 ? 1 : -1));
  const piece1Ahead = board.pieceAt(code1Ahead);
  if (piece1Ahead === undefined) {
    moves.push(new MBoardPossibleMove({
      fromPiece: args.piece,
      from: args.from,
      to: code1Ahead,
      take: undefined
    }));
  }

  // if pawn is at its initial position, it can then move 2 squares ahead
  if (args.piece.moveCount === 0) {
    const code2Ahead = boardRepresentation.codeWithMove(args.from, 0, (args.piece.side === MBSPieceSide.Player1 ? 2 : -2));
    if (piece1Ahead === undefined && board.pieceAt(code2Ahead) === undefined) {
      moves.push(new MBoardPossibleMove({
        fromPiece: args.piece,
        from: args.from,
        to: code2Ahead,
        take: undefined
      }));
    }
  }

  const codeTopRight = boardRepresentation.codeWithMove(args.from, (args.piece.side === MBSPieceSide.Player1 ? 1 : -1), (args.piece.side === MBSPieceSide.Player1 ? 1 : -1));
  const pieceTopRight = board.pieceAt(codeTopRight);
  if (pieceTopRight !== undefined && pieceTopRight.side !== args.piece.side) {
    moves.push(new MBoardPossibleMove({
      fromPiece: args.piece,
      from: args.from,
      to: codeTopRight,
      take: pieceTopRight
    }));
  }

  const codeTopLeft = boardRepresentation.codeWithMove(args.from, (args.piece.side === MBSPieceSide.Player1 ? -1 : 1), (args.piece.side === MBSPieceSide.Player1 ? 1 : -1));
  const pieceTopLeft = board.pieceAt(codeTopLeft);
  if (pieceTopLeft !== undefined && pieceTopLeft.side !== args.piece.side) {
    moves.push(new MBoardPossibleMove({
      fromPiece: args.piece,
      from: args.from,
      to: codeTopLeft,
      take: pieceTopLeft
    }));
  }

  // if pawn is as the row where it can make "en passant" move
  // and the opposite pawn is right next to it
  // and the opposite pawn has just made its first move (thus it is a 2-squares move)
  let enPassantPossible = false;
  switch (args.piece.side) {
    case MBSPieceSide.Player1: enPassantPossible = (pieceRow === player1PawnEnPassantRow); break;
    case MBSPieceSide.Player2: enPassantPossible = (pieceRow === player2PawnEnPassantRow); break;
  }
  if (enPassantPossible) {
    // left/right are inverted if this is player2
    const codeLeft = boardRepresentation.codeWithMove(args.from, (args.piece.side === MBSPieceSide.Player1 ? -1 : 1), 0);
    const pieceLeft = board.pieceAt(codeLeft);
    if (pieceLeft !== undefined && pieceLeft.side !== args.piece.side && pieceLeft.moveCount === 0) {
      const codeTopLeft = boardRepresentation.codeWithMove(args.from, (args.piece.side === MBSPieceSide.Player1 ? -1 : 1), (args.piece.side === MBSPieceSide.Player1 ? 1 : -1));
      if (boardRepresentation.isValidCode(codeTopLeft, board.columnCount, board.rowCount)) {
        moves.push(new MBoardPossibleMove({
          fromPiece: args.piece,
          from: args.from,
          to: codeTopLeft,
          take: pieceLeft
        }));
      }
    }
    const codeRight = boardRepresentation.codeWithMove(args.from, (args.piece.side === MBSPieceSide.Player1 ? -1 : 1), 0);
    const pieceRight = board.pieceAt(codeRight);
    if (pieceRight !== undefined && pieceRight.side !== args.piece.side && pieceRight.moveCount === 0) {
      const codeTopRight = boardRepresentation.codeWithMove(args.from, (args.piece.side === MBSPieceSide.Player1 ? 1 : -1), (args.piece.side === MBSPieceSide.Player1 ? 1 : -1));
      if (boardRepresentation.isValidCode(codeTopRight, board.columnCount, board.rowCount)) {
        moves.push(new MBoardPossibleMove({
          fromPiece: args.piece,
          from: args.from,
          to: codeTopRight,
          take: pieceRight
        }));
      }
    }
  }

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
    const nextCode = boardRepresentation.codeWithMove(args.from, increment.h, increment.v);
    const nextSquare = board.squareAt(nextCode);
    if (nextSquare === undefined) {
      continue;
    }
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

  return moves;
}

function iteratePossibleMoves(board: MBoard, incrementHorizontal: number, incrementVertical: number, args: MPossibleMovesInternalArgs): MBoardPossibleMove[] {
  const moves: MBoardPossibleMove[] = [];

  let cm = incrementHorizontal;
  let rm = incrementVertical;
  let nextCode = boardRepresentation.codeWithMove(args.from, cm, rm);
  let nextSquare = board.squareAt(nextCode);
  while (nextSquare !== undefined && nextSquare.piece === undefined) {
    moves.push(new MBoardPossibleMove({
      fromPiece: args.piece,
      from: args.from,
      to: nextCode,
      take: undefined
    }));
    cm += incrementHorizontal;
    rm += incrementVertical;
    nextCode = boardRepresentation.codeWithMove(args.from, cm, rm);
    nextSquare = board.squareAt(nextCode);
  }
  if (nextSquare !== undefined && nextSquare.piece !== undefined && nextSquare.piece.side !== args.piece.side) {
    moves.push(new MBoardPossibleMove({
      fromPiece: args.piece,
      from: args.from,
      to: nextCode,
      take: nextSquare.piece
    }));
  }

  return moves;
}
