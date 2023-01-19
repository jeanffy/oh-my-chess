import { MAIPlayerStrategy as MAIPlayerStrategy } from './ai-player-strategy.model';
import { MGame } from '../game/game.model';
import { MBoardMoves, MBoardValidMove } from '../board/board-moves.model';
import { MPieceSide } from '../board/square.model';

export class MAIPlayerStrategyRandom extends MAIPlayerStrategy {
  public constructor(game: MGame) {
    super(game);
  }

  public nextMove(color: MPieceSide): MBoardValidMove | undefined {
    console.log('random', this.game.notations.fen);
    const allPossibleMoves = this.game.board.getAllPiecesWithPossibleMoves(color).flatMap(p => p.possibleMoves);
    if (allPossibleMoves.length === 0) {
      console.log('random allPossibleMoves length 0');
      return undefined;
    }
    const allValidMoves = MBoardMoves.validMoves(this.game.info.state, this.game.board, { possibleMoves: allPossibleMoves });
    console.log('greedy allValidMoves length', allValidMoves.length);
    console.log('random allValidMoves', allValidMoves.map(m => `${m.from}${m.to}`));
    const m = Math.floor(Math.random() * allValidMoves.length);
    console.log('random', m);
    return allValidMoves[m];
  }
}
