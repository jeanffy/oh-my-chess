import { BoardModel, BoardMove } from '../board.model';
import { PieceColor } from '../square.model';

export abstract class BoardAIPlayerStrategyModel {
  public constructor(protected board: BoardModel) {
  }

  public async getNextMove(color: PieceColor): Promise<BoardMove> {
    await new Promise(resolve => setTimeout(resolve, 500)); // to simulate some thinking
    return new Promise<BoardMove>((resolve, reject) => {
      const move = this.nextMove(color);
      if (move === undefined) {
        reject('no move possible');
      } else {
        resolve(move);
      }
    });
  }

  public abstract nextMove(color: PieceColor): BoardMove | undefined;
}
