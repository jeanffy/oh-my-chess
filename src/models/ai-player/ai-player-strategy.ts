import { MBoardValidMove } from '../board/board-moves';
import { MGame } from '../game/game';
import { MBSPieceSide } from '../board/board-square';

export abstract class MAIPlayerStrategy {
  public constructor(protected game: MGame) {
  }

  public async getNextMove(pieceSide: MBSPieceSide): Promise<MBoardValidMove | undefined> {
    return new Promise<MBoardValidMove | undefined>((resolve, _reject) => {
      const move = this.nextMove(pieceSide);
      resolve(move);
    });
  }

  public abstract nextMove(side: MBSPieceSide): MBoardValidMove | undefined;
}
