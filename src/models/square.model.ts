import { SquareCode } from './board/board-representation.model';

export enum PieceKind {
  Bishop = 'bishop',
  King = 'king',
  Knight = 'knight',
  Pawn = 'pawn',
  Queen = 'queen',
  Rook = 'rook'
}

// player1 starts at the bottom of the board
// player2 starts at the top of the board
export enum PieceSide {
  Player1 = 'player1',
  Player2 = 'player2'
}

export interface Piece {
  kind: PieceKind;
  side: PieceSide;
  strength: number;
}

export interface SquareModel {
  code: SquareCode;
  piece?: Piece;
}
