import { BoardModel, BoardValidMove } from '../board.model';
import { PieceColor } from '../square.model';

export abstract class BoardAIPlayerStrategyModel {
  public constructor(protected board: BoardModel) {
  }

  public async getNextMove(color: PieceColor): Promise<BoardValidMove> {
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
