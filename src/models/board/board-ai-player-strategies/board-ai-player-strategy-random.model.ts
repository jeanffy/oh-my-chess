import { BoardMovesModel, BoardValidMove } from '../board-moves.model';
import { BoardModel } from '../board.model';
import { PieceSide } from '../../square.model';
import { BoardAIPlayerStrategyModel } from './board-ai-player-strategy.model';

export class BoardAIPlayerStrategyRandomModel extends BoardAIPlayerStrategyModel {
  public constructor(board: BoardModel) {
    super(board);
  }

  public nextMove(color: PieceSide): BoardValidMove | undefined {
    console.log('random', this.board.gameStateNotations.fen);
    const allPossibleMoves = this.board.getAllPiecesWithPossibleMoves(color).flatMap(p => p.possibleMoves);
    if (allPossibleMoves.length === 0) {
      console.log('random allPossibleMoves length 0');
      return undefined;
    }
    const allValidMoves = BoardMovesModel.validMoves(this.board, { possibleMoves: allPossibleMoves });
    console.log('greedy allValidMoves length', allValidMoves.length);
    console.log('random allValidMoves', allValidMoves.map(m => `${m.from}${m.to}`));
    const m = Math.floor(Math.random() * allValidMoves.length);
    console.log('random', m);
    return allValidMoves[m];
  }
}
