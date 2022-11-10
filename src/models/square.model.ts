import { SquareCode } from './board-representation.model';

export enum PieceKind {
  Bishop = 'bishop',
  King = 'king',
  Knight = 'knight',
  Pawn = 'pawn',
  Queen = 'queen',
  Rook = 'rook'
}

export enum PieceSide {
  P1 = 'p1',
  P2 = 'p2'
}

export interface Piece {
  kind: PieceKind;
  side: PieceSide;
  strength: number;
  firstMove: boolean;
}

export interface SquareModel {
  code: SquareCode;
  piece?: Piece;
}
