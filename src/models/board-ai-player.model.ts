import { BoardAIPlayerStrategyGreedyModel } from './board-ai-player-strategies/board-ai-player-strategy-greedy.model';
import { BoardAIPlayerStrategyRandomModel } from './board-ai-player-strategies/board-ai-player-strategy-random.model';
import { BoardModel, BoardValidMove } from './board.model';
import { PieceColor } from './square.model';

export enum BoardAIPlayerStrategy {
  Random,
  Greedy
}

export class BoardAIPlayerModel {
  public constructor(private board: BoardModel) {
  }

  public async getNextMove(color: PieceColor, strategy: BoardAIPlayerStrategy): Promise<BoardValidMove> {
    switch (strategy) {
      case BoardAIPlayerStrategy.Random:
        await new Promise(resolve => setTimeout(resolve, 500)); // to simulate some thinking
        return new BoardAIPlayerStrategyRandomModel(this.board).getNextMove(color);
      case BoardAIPlayerStrategy.Greedy:
        await new Promise(resolve => setTimeout(resolve, 500)); // to simulate some thinking
        return new BoardAIPlayerStrategyGreedyModel(this.board).getNextMove(color);
    }
  }
}
