import { MBoardMoves, MBoardValidMove } from '../board/board-moves.model';
import { MGame } from '../game/game.model';
import { MPieceSide } from '../board/square.model';
import { MAIPlayerStrategyRandom } from './ai-player-strategy-random.model';
import { MAIPlayerStrategy as MAIPlayerStrategy } from './ai-player-strategy.model';

export class MAIPlayerStrategyGreedy extends MAIPlayerStrategy {
  public constructor(game: MGame) {
    super(game);
  }

  public nextMove(color: MPieceSide): MBoardValidMove | undefined {
    console.log('greedy', this.game.notations.fen);
    const allPossibleMoves = this.game.board.getAllPiecesWithPossibleMoves(color).flatMap(p => p.possibleMoves);
    if (allPossibleMoves.length === 0) {
      console.log('greedy allPossibleMoves length 0');
      return undefined;
    }
    const allValidMoves = MBoardMoves.validMoves(this.game.info.state, this.game.board, { possibleMoves: allPossibleMoves });
    console.log('greedy allValidMoves length', allValidMoves.length);
    console.log('greedy allValidMoves', allValidMoves.map(m => `${m.from}-${m.to}`));
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
      console.log('greedy highestMove found', `${highestMove.from}${highestMove.to}`);
      return highestMove;
    }
    console.log('greedy highestMove not found -> using random');
    // if no move takes a piece, just use random strategy as a fallback
    return new MAIPlayerStrategyRandom(this.game).nextMove(color);
  }
}
