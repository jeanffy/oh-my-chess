import { MSquareCode } from './board-representation';

export enum MBSPieceKind {
  Bishop = 'bishop',
  King = 'king',
  Knight = 'knight',
  Pawn = 'pawn',
  Queen = 'queen',
  Rook = 'rook'
}

// player1 starts at the bottom of the board
// player2 starts at the top of the board
export enum MBSPieceSide {
  Player1 = 'player1',
  Player2 = 'player2'
}

export class MBSPiece {
  public kind: MBSPieceKind;
  public side: MBSPieceSide;
  public strength: number;

  public constructor(other?: Partial<MBSPiece>) {
    this.kind = (other?.kind !== undefined ? other.kind : MBSPieceKind.Pawn);
    this.side = (other?.side !== undefined ? other.side : MBSPieceSide.Player1);
    this.strength = (other?.strength !== undefined ? other.strength : 0);
  }

  public getAlgebraicLetter(): string {
    switch (this.kind) {
      case MBSPieceKind.Bishop: return 'B';
      case MBSPieceKind.King: return 'K';
      case MBSPieceKind.Knight: return 'N';
      case MBSPieceKind.Pawn: return '';
      case MBSPieceKind.Queen: return 'Q';
      case MBSPieceKind.Rook: return 'R';
    }
  }
}

export interface MBoardSquare {
  code: MSquareCode;
  piece?: MBSPiece;
}
