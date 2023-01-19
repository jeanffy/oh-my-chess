import { MGame } from '../game/game.model';
import { MAIPlayerStrategyGreedy } from './ai-player-strategy-greedy.model';
import { MAIPlayerStrategyRandom } from './ai-player-strategy-random.model';
import { MBoardValidMove } from '../board/board-moves.model';
import { MPieceSide } from '../board/square.model';

export enum MAIPlayerStrategy {
  Random,
  Greedy
}

const fakeThinkingDelay = 100;

export class MAIPlayer {
  public constructor(private game: MGame) {
  }

  public async getNextMove(color: MPieceSide, strategy: MAIPlayerStrategy): Promise<MBoardValidMove> {
    switch (strategy) {
      case MAIPlayerStrategy.Random:
        await new Promise(resolve => setTimeout(resolve, fakeThinkingDelay)); // to simulate some thinking
        return new MAIPlayerStrategyRandom(this.game).getNextMove(color);
      case MAIPlayerStrategy.Greedy:
        await new Promise(resolve => setTimeout(resolve, fakeThinkingDelay)); // to simulate some thinking
        return new MAIPlayerStrategyGreedy(this.game).getNextMove(color);
    }
  }
}
