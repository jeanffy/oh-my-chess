import { BoardAIPlayerStrategyGreedyModel } from './board-ai-player-strategies/board-ai-player-strategy-greedy.model';
import { BoardAIPlayerStrategyRandomModel } from './board-ai-player-strategies/board-ai-player-strategy-random.model';
import { BoardValidMove } from './board-moves.model';
import { BoardModel } from './board.model';
import { PieceSide } from '../square.model';

export enum BoardAIPlayerStrategy {
  Random,
  Greedy
}

const fakeThinkingDelay = 100;

export class BoardAIPlayerModel {
  public constructor(private board: BoardModel) {
  }

  public async getNextMove(color: PieceSide, strategy: BoardAIPlayerStrategy): Promise<BoardValidMove> {
    switch (strategy) {
      case BoardAIPlayerStrategy.Random:
        await new Promise(resolve => setTimeout(resolve, fakeThinkingDelay)); // to simulate some thinking
        return new BoardAIPlayerStrategyRandomModel(this.board).getNextMove(color);
      case BoardAIPlayerStrategy.Greedy:
        await new Promise(resolve => setTimeout(resolve, fakeThinkingDelay)); // to simulate some thinking
        return new BoardAIPlayerStrategyGreedyModel(this.board).getNextMove(color);
    }
  }
}
