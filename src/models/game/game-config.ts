import { MAIPlayerStrategy } from '../ai-player/ai-player';

export class MGameConfig {
  public strategy: MAIPlayerStrategy;

  public constructor(other?: Partial<MGameConfig>) {
    this.strategy = (other?.strategy !== undefined ? other.strategy : MAIPlayerStrategy.DeepThinker);
  }
}
