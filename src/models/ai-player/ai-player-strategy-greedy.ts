import { MBoardValidMove } from '../board/board-moves';
import { MGame } from '../game/game';
import { MBSPieceSide } from '../board/board-square';
import { MAIPlayerStrategyRandom } from './ai-player-strategy-random';
import { MAIPlayerStrategy } from './ai-player-strategy';

export class MAIPlayerStrategyGreedy extends MAIPlayerStrategy {
  public constructor(game: MGame) {
    super(game);
  }

  public nextMove(pieceSide: MBSPieceSide): MBoardValidMove | undefined {
    const validMoves = this.game.getAllValidMoves(pieceSide);
    if (validMoves.length === 0) {
      return undefined;
    }
    // among all moves that take a piece, find the one which takes the highest piece
    let higherStrength = Number.MIN_SAFE_INTEGER;
    let highestMove: MBoardValidMove | undefined;
    for (const validMove of validMoves) {
      if (validMove.takenPiece !== undefined && validMove.takenPiece.strength > higherStrength) {
        higherStrength = validMove.takenPiece.strength;
        highestMove = validMove;
      }
    }
    if (highestMove !== undefined) {
      return highestMove;
    }
    // if no move takes a piece, just use random strategy as a fallback
    return new MAIPlayerStrategyRandom(this.game).nextMove(pieceSide);
  }
}
