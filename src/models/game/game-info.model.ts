import { MAIPlayerStrategy } from '../ai-player/ai-player.model';
import { MGameState } from './game-state.model';
import { MBoardMaterialScores, MBoard } from '../board/board.model';
import { MPiece, MPieceKind, MPieceSide } from '../board/square.model';
import { MBoardMove } from '../board/board-moves.model';

export class MGameInfo {
  public strategy: MAIPlayerStrategy;
  public turn: MPieceSide;
  public materialScores: MBoardMaterialScores;
  public fullMoves: number;
  public halfMoves: number;
  public state: MGameState;

  public constructor(other?: Partial<MGameInfo>) {
    this.strategy = (other?.strategy !== undefined ? other.strategy : MAIPlayerStrategy.Random);
    this.turn = (other?.turn !== undefined ? other.turn : MPieceSide.Player1);
    this.materialScores = new MBoardMaterialScores(other?.materialScores);
    this.fullMoves = (other?.fullMoves !== undefined ? other.fullMoves : 0);
    this.halfMoves = (other?.halfMoves !== undefined ? other.halfMoves : 0);
    this.state = new MGameState(other?.state);
  }

  public update(board: MBoard, move: MBoardMove, takenPiece?: MPiece): void {
    this.turn = (this.turn === MPieceSide.Player1 ? MPieceSide.Player2 : MPieceSide.Player1);

    if (this.turn === MPieceSide.Player1) {
      this.fullMoves++;
    }

    this.halfMoves++;
    if (takenPiece !== undefined || move.fromPiece.kind === MPieceKind.Pawn) {
      this.halfMoves = 0;
    }

    this.materialScores = MBoardMaterialScores.createFromBoard(board);
  }
}
