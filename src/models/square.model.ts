import { SquareCode } from './board-representation.model';

export enum PieceKind {
  Bishop = 'bishiop',
  King = 'king',
  Knight = 'knight',
  Pawn = 'pawn',
  Queen = 'queen',
  Rook = 'rook'
}

export enum PieceColor {
  Black = 'b',
  White = 'w'
}

export interface Piece {
  kind: PieceKind;
  color: PieceColor;
  strength: number;
  firstMove: boolean;
}

export interface SquareModel {
  code: SquareCode;
  piece?: Piece;
}
