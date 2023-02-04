import * as boardMoves from '../board/board-moves';
import { MBoard } from '../board/board';
import { MGameConfig } from './game-config';
import { MGameNotations } from './game-notations';
import { MBSPiece, MBSPieceSide } from '../board/board-square';
import { MGameState } from './game-state';

export class MGame {
  public board: MBoard;
  public config: MGameConfig;
  public state: MGameState;
  public notations: MGameNotations;

  public constructor(other?: Partial<MGame>) {
    this.board = new MBoard(other?.board);
    this.config = new MGameConfig(other?.config);
    this.state = new MGameState(other?.state);
    this.notations = new MGameNotations(other?.notations);
  }

  public boardMove(move: boardMoves.MBoardValidMove): MBSPiece | undefined {
    this.board.move(move);
    this.state.update(this.board, move);
    this.notations = MGameNotations.createFromGame(this);
    return move.take;
  }

  public getAllValidMoves(pieceSide: MBSPieceSide): boardMoves.MBoardValidMove[] {
    const allPossibleMoves = this.board.getAllPiecesWithPossibleMoves(pieceSide).flatMap(p => p.possibleMoves);
    if (allPossibleMoves.length === 0) {
      return [];
    }
    const allValidMoves = boardMoves.computeValidMoves(this.state, this.board, { possibleMoves: allPossibleMoves });
    return allValidMoves;
  }

  public static createWithFEN(fen: string): MGame {
    const game = new MGame();
    const result = game.board.initWithFEN(fen);
    game.state = MGameState.createFromBoard(game.board);
    game.state.turn = result.turn;
    game.notations = MGameNotations.createFromGame(game);
    return game;
  }

  public static createWithBoard(board: MBoard, turn: MBSPieceSide): MGame {
    const game = new MGame();
    game.board = board;
    game.state = MGameState.createFromBoard(game.board);
    game.state.turn = turn;
    game.notations = MGameNotations.createFromGame(game);
    return game;
  }
}
