import { MGame } from '../game/game';
import { MAIPlayerStrategyGreedy } from './ai-player-strategy-greedy';
import { MAIPlayerStrategyRandom } from './ai-player-strategy-random';
import { MBoardValidMove } from '../board/board-moves';
import { MBSPieceSide } from '../board/board-square';
import { MAIPlayerStrategyDeepThinker } from './ai-player-strategy-deep-thinker';

export enum MAIPlayerStrategy {
  Random,
  Greedy,
  DeepThinker
}

const fakeThinkingDelay = 500;

export class MAIPlayer {
  public constructor(private game: MGame) {
  }

  public async getNextMove(side: MBSPieceSide, strategy: MAIPlayerStrategy): Promise<MBoardValidMove | undefined> {
    switch (strategy) {
      case MAIPlayerStrategy.Random:
        await new Promise(resolve => setTimeout(resolve, fakeThinkingDelay)); // to simulate some thinking
        return new MAIPlayerStrategyRandom(this.game).getNextMove(side);
      case MAIPlayerStrategy.Greedy:
        await new Promise(resolve => setTimeout(resolve, fakeThinkingDelay)); // to simulate some thinking
        return new MAIPlayerStrategyGreedy(this.game).getNextMove(side);
      case MAIPlayerStrategy.DeepThinker:
        await new Promise(resolve => setTimeout(resolve, fakeThinkingDelay)); // to simulate some thinking (to be removed when strategy is implemented)
        return new MAIPlayerStrategyDeepThinker(this.game).getNextMove(side)
    }
  }
}
