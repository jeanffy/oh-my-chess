import { BoardModel, BoardValidMove } from '../board.model';
import { PieceColor } from '../square.model';

export abstract class BoardAIPlayerStrategyModel {
  public constructor(protected board: BoardModel) {
  }

  public async getNextMove(color: PieceColor): Promise<BoardValidMove> {
    await new Promise(resolve => setTimeout(resolve, 500)); // to simulate some thinking
    return new Promise<BoardValidMove>((resolve, reject) => {
      const move = this.nextMove(color);
      if (move === undefined) {
        reject('no move possible');
      } else {
        resolve(move);
      }
    });
  }

  public abstract nextMove(color: PieceColor): BoardValidMove | undefined;
}
