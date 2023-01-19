import { MBoardValidMove } from '../board/board-moves.model';
import { MGame } from '../game/game.model';
import { MPieceSide } from '../board/square.model';

export abstract class MAIPlayerStrategy {
  public constructor(protected game: MGame) {
  }

  public async getNextMove(color: MPieceSide): Promise<MBoardValidMove> {
    return new Promise<MBoardValidMove>((resolve, reject) => {
      const move = this.nextMove(color);
      if (move === undefined) {
        reject('no move possible');
      } else {
        resolve(move);
      }
    });
  }

  public abstract nextMove(color: MPieceSide): MBoardValidMove | undefined;
}
