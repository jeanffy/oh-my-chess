import { BoardMovesModel, BoardValidMove } from '../board-moves.model';
import { BoardModel } from '../board.model';
import { PieceSide } from '../../square.model';
import { BoardAIPlayerStrategyRandomModel } from './board-ai-player-strategy-random.model';
import { BoardAIPlayerStrategyModel } from './board-ai-player-strategy.model';

export class BoardAIPlayerStrategyGreedyModel extends BoardAIPlayerStrategyModel {
  public constructor(board: BoardModel) {
    super(board);
  }

  public nextMove(color: PieceSide): BoardValidMove | undefined {
    console.log('greedy', this.board.gameStateNotations.fen);
    const allPossibleMoves = this.board.getAllPiecesWithPossibleMoves(color).flatMap(p => p.possibleMoves);
    if (allPossibleMoves.length === 0) {
      console.log('greedy allPossibleMoves length 0');
      return undefined;
    }
    const allValidMoves = BoardMovesModel.validMoves(this.board, { possibleMoves: allPossibleMoves });
    console.log('greedy allValidMoves length', allValidMoves.length);
    console.log('greedy allValidMoves', allValidMoves.map(m => `${m.from}-${m.to}`));
    // among all moves that take a piece, find the one which takes the highest piece
    let higherStrength = Number.MIN_SAFE_INTEGER;
    let highestMove: BoardValidMove | undefined;
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
    return new BoardAIPlayerStrategyRandomModel(this.board).nextMove(color);
  }
}
