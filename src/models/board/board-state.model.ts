import { BoardPossibleMove } from './board-moves.model';
import { BoardModel } from './board.model';
import { PieceSide, PieceKind } from '../square.model';

export interface BoardState {
  stalemate: false;
  player1Check: boolean;
  player1Checkmate: boolean;
  player2Check: boolean;
  player2Checkmate: boolean;
}

interface PieceColorState {
  check: boolean;
  checkmate: boolean;
}

export namespace BoardStateModel {
  export function computeState(board: BoardModel): BoardState {
    const p1PossibleMoves = board.getAllPiecesWithPossibleMoves(PieceSide.Player1).flatMap(p => p.possibleMoves);
    const p2PossibleMoves = board.getAllPiecesWithPossibleMoves(PieceSide.Player2).flatMap(p => p.possibleMoves);

    const p1State = computePlayerState(board, PieceSide.Player1, p1PossibleMoves, p2PossibleMoves);
    const p2State = computePlayerState(board, PieceSide.Player2, p2PossibleMoves, p1PossibleMoves);

    return {
      stalemate: false, // TODO: detect stalemate
      player1Check: p1State.check,
      player1Checkmate: p1State.checkmate,
      player2Check: p2State.check,
      player2Checkmate: p2State.checkmate
    };
  }

  function computePlayerState(board: BoardModel,
                              playerSide: PieceSide,
                              playerPossibleMoves: BoardPossibleMove[],
                              opponentPossibleMoves: BoardPossibleMove[]): PieceColorState {
    const opponentSide = (playerSide === PieceSide.Player1 ? PieceSide.Player2 : PieceSide.Player1);

    // - a player is in check state if any of the opponent's possible moves takes his king
    // - a player is in checkmate state if all of his possible moves still leaves him in a check state

    const check = opponentPossibleMoves.some(m => m.take?.kind === PieceKind.King);

    let checkmate = true;
    for (const move of playerPossibleMoves) {
      const nextBoard = board.cloneWithMove(move);
      const nextOpponentPossibleMoves = nextBoard.getAllPiecesWithPossibleMoves(opponentSide).flatMap(p => p.possibleMoves);
      if (!nextOpponentPossibleMoves.some(m => m.take?.kind === PieceKind.King)) {
        checkmate = false; // at least one move is possible without taking the king -> not in checkmate
        break;
      }
    }

    return { check: check, checkmate: checkmate };
  }
}
