import { BoardValidMove } from '../board-moves.model';
import { BoardModel } from '../board.model';
import { PieceSide } from '../../square.model';

export abstract class BoardAIPlayerStrategyModel {
  public constructor(protected board: BoardModel) {
  }

  public async getNextMove(color: PieceSide): Promise<BoardValidMove> {
    return new Promise<BoardValidMove>((resolve, reject) => {
      const move = this.nextMove(color);
      if (move === undefined) {
        reject('no move possible');
      } else {
        resolve(move);
      }
    });
  }

  public abstract nextMove(color: PieceSide): BoardValidMove | undefined;
}
