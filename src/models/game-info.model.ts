import { BoardAIPlayerStrategy } from './board-ai-player.model';
import { BoardState } from './board-state.model';
import { BoardGameStateNotations, BoardMaterialScores } from './board.model';
import { PieceSide } from './square.model';

export interface GameInfoModel {
  strategy: BoardAIPlayerStrategy;
  turn: PieceSide;
  materialScores: BoardMaterialScores;
  gameState: BoardState;
  gameStateNotations: BoardGameStateNotations;
}
