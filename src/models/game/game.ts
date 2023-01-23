import { MBoardValidMove } from '../board/board-moves';
import { MBoard } from '../board/board';
import { MGameConfig } from './game-config';
import { MGameNotations } from './game-notations';
import { MBSPiece } from '../board/board-square';
import { MGameState } from './game-state';

export class MGame {
  public board: MBoard;
  public config: MGameConfig;
  public state: MGameState;
  public notations: MGameNotations;

  public constructor(other?: Partial<MGame>) {
    this.board = new MBoard(other?.board);
    this.config = new MGameConfig(other?.config);
    this.state = new MGameState(other?.state);
    this.notations = new MGameNotations(other?.notations);
  }

  public boardMove(move: MBoardValidMove): MBSPiece | undefined {
    const taken = this.board.move(move);
    this.state.update(this.board, move, taken);
    this.notations = MGameNotations.createFromGame(this);
    return taken;
  }

  public static createWithFEN(fen: string): MGame {
    const o = new MGame();
    const result = o.board.initWithFEN(fen);
    o.state = MGameState.createFromBoard(o.board);
    o.state.turn = result.turn;
    o.notations = MGameNotations.createFromGame(o);
    return o;
  }
}
