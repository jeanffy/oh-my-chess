import { MBoardPossibleMove } from '../board/board-moves.model';
import { MBoard } from '../board/board.model';
import { MPieceSide, MPieceKind } from '../board/square.model';

export class MGameState {
  public stalemate: boolean;
  public player1Check: boolean;
  public player1Checkmate: boolean;
  public player2Check: boolean;
  public player2Checkmate: boolean;

  public constructor(other?: Partial<MGameState>) {
    this.stalemate = (other?.stalemate !== undefined ? other.stalemate : false);
    this.player1Check = (other?.player1Check !== undefined ? other.player1Check : false);
    this.player1Checkmate = (other?.player1Checkmate !== undefined ? other.player1Checkmate : false);
    this.player2Check = (other?.player2Check !== undefined ? other.player2Check : false);
    this.player2Checkmate = (other?.player2Checkmate !== undefined ? other.player2Checkmate : false);
  }

  public static createFromBoard(board: MBoard): MGameState {
    const p1PossibleMoves = board.getAllPiecesWithPossibleMoves(MPieceSide.Player1).flatMap(p => p.possibleMoves);
    const p2PossibleMoves = board.getAllPiecesWithPossibleMoves(MPieceSide.Player2).flatMap(p => p.possibleMoves);

    const p1State = MGameStateHelper.computePlayerState(board, MPieceSide.Player1, p1PossibleMoves, p2PossibleMoves);
    const p2State = MGameStateHelper.computePlayerState(board, MPieceSide.Player2, p2PossibleMoves, p1PossibleMoves);

    const newBoardState = new MGameState();
    newBoardState.stalemate = false; // TODO: detect stalemate
    newBoardState.player1Check = p1State.check;
    newBoardState.player1Checkmate = p1State.checkmate;
    newBoardState.player2Check = p2State.check;
    newBoardState.player2Checkmate = p2State.checkmate;
    return newBoardState;
  }
}

namespace MGameStateHelper {
  export interface PieceColorState {
    check: boolean;
    checkmate: boolean;
  }

  export function computePlayerState(board: MBoard,
                                    playerSide: MPieceSide,
                                    playerPossibleMoves: MBoardPossibleMove[],
                                    opponentPossibleMoves: MBoardPossibleMove[]): PieceColorState {
    const opponentSide = (playerSide === MPieceSide.Player1 ? MPieceSide.Player2 : MPieceSide.Player1);

    // - a player is in check state if any of the opponent's possible moves takes his king
    // - a player is in checkmate state if all of his possible moves still leaves him in a check state

    const check = opponentPossibleMoves.some(m => m.take?.kind === MPieceKind.King);

    let checkmate = true;
    for (const move of playerPossibleMoves) {
      const nextBoard = board.cloneWithMove(move);
      const nextOpponentPossibleMoves = nextBoard.getAllPiecesWithPossibleMoves(opponentSide).flatMap(p => p.possibleMoves);
      if (!nextOpponentPossibleMoves.some(m => m.take?.kind === MPieceKind.King)) {
        checkmate = false; // at least one move is possible without taking the king -> not in checkmate
        break;
      }
    }

    return { check: check, checkmate: checkmate };
  }
}
