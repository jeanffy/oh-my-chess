import { MSquareCode } from './board-representation.model';

export enum MPieceKind {
  Bishop = 'bishop',
  King = 'king',
  Knight = 'knight',
  Pawn = 'pawn',
  Queen = 'queen',
  Rook = 'rook'
}

// player1 starts at the bottom of the board
// player2 starts at the top of the board
export enum MPieceSide {
  Player1 = 'player1',
  Player2 = 'player2'
}

export interface MPiece {
  kind: MPieceKind;
  side: MPieceSide;
  strength: number;
}

export interface MSquare {
  code: MSquareCode;
  piece?: MPiece;
}
