import { indexToCode, MSquareCode } from './board-representation';

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
  Player1 = 1,
  Player2 = 2
}

export class MBSPiece {
  public kind: MBSPieceKind;
  public side: MBSPieceSide;
  public code: MSquareCode;
  public strength: number;

  public moveCount: number;

  public constructor(other?: Partial<MBSPiece>) {
    this.kind = (other?.kind !== undefined ? other.kind : MBSPieceKind.Pawn);
    this.side = (other?.side !== undefined ? other.side : MBSPieceSide.Player1);
    this.code = (other?.code !== undefined ? other.code : indexToCode({ ci: 0, ri: 0 }));
    this.strength = (other?.strength !== undefined ? other.strength : 0);
    this.moveCount = (other?.moveCount !== undefined ? other.moveCount : 0);
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
