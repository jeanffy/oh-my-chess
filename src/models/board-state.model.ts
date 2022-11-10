import { BoardPossibleMove } from './board-moves.model';
import { BoardModel } from './board.model';
import { PieceSide, PieceKind } from './square.model';

export interface BoardState {
  stalemate: false;
  p1Check: boolean;
  p1Checkmate: boolean;
  p2Check: boolean;
  p2Checkmate: boolean;
}

interface PieceColorState {
  check: boolean;
  checkmate: boolean;
}

export namespace BoardStateModel {
  export function computeState(board: BoardModel): BoardState {
    const p1PossibleMoves = board.getAllPiecesWithPossibleMoves(PieceSide.P1).flatMap(p => p.possibleMoves);
    const p2PossibleMoves = board.getAllPiecesWithPossibleMoves(PieceSide.P2).flatMap(p => p.possibleMoves);

    const p1State = computePlayerState(board, PieceSide.P1, p1PossibleMoves, p2PossibleMoves);
    const p2State = computePlayerState(board, PieceSide.P2, p2PossibleMoves, p1PossibleMoves);

    return {
      stalemate: false, // TODO: detect stalemate
      p1Check: p1State.check,
      p1Checkmate: p1State.checkmate,
      p2Check: p2State.check,
      p2Checkmate: p2State.checkmate
    };
  }

  function computePlayerState(board: BoardModel,
                              playerColor: PieceSide,
                              playerPossibleMoves: BoardPossibleMove[],
                              opponentPossibleMoves: BoardPossibleMove[]): PieceColorState {
    const opponentColor = (playerColor === PieceSide.P1 ? PieceSide.P2 : PieceSide.P1);

    // - a player is in check state if any of the opponent's possible moves takes his king
    // - a player is in checkmate state if all of his possible moves still leaves him in a check state

    const check = opponentPossibleMoves.some(m => m.take?.kind === PieceKind.King);

    let checkmate = true;
    for (const move of playerPossibleMoves) {
      const nextBoard = board.cloneWithMove(move);
      const nextOpponentPossibleMoves = nextBoard.getAllPiecesWithPossibleMoves(opponentColor).flatMap(p => p.possibleMoves);
      if (!nextOpponentPossibleMoves.some(m => m.take?.kind === PieceKind.King)) {
        checkmate = false; // at least one move is possible without taking the king -> not in checkmate
        break;
      }
    }

    return { check: check, checkmate: checkmate };
  }
}
