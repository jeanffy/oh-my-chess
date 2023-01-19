import { MBoardMove } from '../board/board-moves.model';
import { MBoard } from '../board/board.model';
import { MGameInfo } from './game-info.model';
import { MGameNotations } from './game-notations.model';
import { MPiece } from '../board/square.model';

export class MGame {
  public board: MBoard;
  public info: MGameInfo;
  public notations: MGameNotations;

  public constructor(other?: Partial<MGame>) {
    this.board = new MBoard(other?.board);
    this.info = new MGameInfo(other?.info);
    this.notations = new MGameNotations(other?.notations);
  }

  public boardMove(move: MBoardMove): MPiece | undefined {
    const taken = this.board.move(move);
    this.info.update(this.board, move, taken);
    this.notations = MGameNotations.createFromGame(this);
    return taken;
  }

  public static createWithFEN(fen: string): MGame {
    const o = new MGame();
    o.board.initWithFEN(fen);
    return o;
  }
}
