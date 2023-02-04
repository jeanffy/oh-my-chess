import { MBoard } from './board';
import { MBSPieceSide } from './board-square';

export class MBoardMaterialScores {
  public player1: number;
  public player2: number;

  public constructor(other?: Partial<MBoardMaterialScores>) {
    this.player1 = (other?.player1 !== undefined ? other.player1 : 0);
    this.player2 = (other?.player2 !== undefined ? other.player2 : 0);
  }

  public static createFromBoard(board: MBoard): MBoardMaterialScores {
    const scores = new MBoardMaterialScores({ player1: 0, player2: 0 });
    board.forEachPiece(piece => {
      switch (piece.side) {
        case MBSPieceSide.Player1: scores.player1 += piece.strength; break;
        case MBSPieceSide.Player2: scores.player2 += piece.strength; break;
      }
    });
    return scores;
  }
}
