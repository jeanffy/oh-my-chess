import { BoardAIPlayerStrategy } from './board-ai-player.model';
import { BoardGameState, BoardMaterialScores } from './board.model';
import { PieceColor } from './square.model';

export interface GameInfoModel {
  strategy: BoardAIPlayerStrategy;
  turn: PieceColor;
  materialScores: BoardMaterialScores;
  gameState: BoardGameState;
}
