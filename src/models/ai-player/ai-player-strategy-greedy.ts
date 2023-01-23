import { MBoardMoves, MBoardValidMove } from '../board/board-moves';
import { MGame } from '../game/game';
import { MBSPieceSide } from '../board/board-square';
import { MAIPlayerStrategyRandom } from './ai-player-strategy-random';
import { MAIPlayerStrategy as MAIPlayerStrategy } from './ai-player-strategy';

export class MAIPlayerStrategyGreedy extends MAIPlayerStrategy {
  public constructor(game: MGame) {
    super(game);
  }

  public nextMove(color: MBSPieceSide): MBoardValidMove | undefined {
    const allPossibleMoves = this.game.board.getAllPiecesWithPossibleMoves(color).flatMap(p => p.possibleMoves);
    if (allPossibleMoves.length === 0) {
      return undefined;
    }
    const allValidMoves = MBoardMoves.validMoves(this.game.state, this.game.board, { possibleMoves: allPossibleMoves });
    // among all moves that take a piece, find the one which takes the highest piece
    let higherStrength = Number.MIN_SAFE_INTEGER;
    let highestMove: MBoardValidMove | undefined;
    allValidMoves.forEach(m => {
      if (m.take !== undefined && m.take.strength > higherStrength) {
        higherStrength = m.take.strength;
        highestMove = m;
      }
    });
    if (highestMove !== undefined) {
      return highestMove;
    }
    // if no move takes a piece, just use random strategy as a fallback
    return new MAIPlayerStrategyRandom(this.game).nextMove(color);
  }
}
