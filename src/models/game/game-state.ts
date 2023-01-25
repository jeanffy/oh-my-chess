import { MBoardPossibleMove, MBoardValidMove } from '../board/board-moves';
import { MBoard, MBoardMaterialScores } from '../board/board';
import { MBSPieceSide, MBSPieceKind, MBSPiece } from '../board/board-square';

export class MGameState {
  public turn: MBSPieceSide;
  public materialScores: MBoardMaterialScores;
  public fullMoves: number;
  public halfMoves: number;
  public moves: MBoardValidMove[];
  public stalemate: boolean;
  public player1Check: boolean;
  public player1Checkmate: boolean;
  public player2Check: boolean;
  public player2Checkmate: boolean;

  public constructor(other?: Partial<MGameState>) {
    this.turn = (other?.turn !== undefined ? other.turn : MBSPieceSide.Player1);
    this.materialScores = new MBoardMaterialScores(other?.materialScores);
    this.fullMoves = (other?.fullMoves !== undefined ? other.fullMoves : 0);
    this.halfMoves = (other?.halfMoves !== undefined ? other.halfMoves : 0);
    this.moves = (other?.moves === undefined ? [] : other.moves.map(m => new MBoardValidMove(m)));
    this.stalemate = (other?.stalemate !== undefined ? other.stalemate : false);
    this.player1Check = (other?.player1Check !== undefined ? other.player1Check : false);
    this.player1Checkmate = (other?.player1Checkmate !== undefined ? other.player1Checkmate : false);
    this.player2Check = (other?.player2Check !== undefined ? other.player2Check : false);
    this.player2Checkmate = (other?.player2Checkmate !== undefined ? other.player2Checkmate : false);
  }

  public getLastMove(): MBoardValidMove | undefined {
    return (this.moves.length === 0 ? undefined : this.moves[this.moves.length - 1]);
  }

  public update(board: MBoard, move: MBoardValidMove, takenPiece?: MBSPiece): void {
    this.moves.push(move);

    this.turn = (this.turn === MBSPieceSide.Player1 ? MBSPieceSide.Player2 : MBSPieceSide.Player1);

    if (this.turn === MBSPieceSide.Player1) {
      this.fullMoves++;
    }

    this.halfMoves++;
    if (takenPiece !== undefined || move.fromPiece.kind === MBSPieceKind.Pawn) {
      this.halfMoves = 0;
    }

    this.materialScores = MBoardMaterialScores.createFromBoard(board);
  }

  public static createFromBoard(board: MBoard): MGameState {
    const p1PossibleMoves = board.getAllPiecesWithPossibleMoves(MBSPieceSide.Player1).flatMap(p => p.possibleMoves);
    const p2PossibleMoves = board.getAllPiecesWithPossibleMoves(MBSPieceSide.Player2).flatMap(p => p.possibleMoves);

    const p1State = computePlayerState(board, MBSPieceSide.Player1, p1PossibleMoves, p2PossibleMoves);
    const p2State = computePlayerState(board, MBSPieceSide.Player2, p2PossibleMoves, p1PossibleMoves);

    const newBoardState = new MGameState();
    newBoardState.stalemate = false; // TODO: detect stalemate
    newBoardState.player1Check = p1State.check;
    newBoardState.player1Checkmate = p1State.checkmate;
    newBoardState.player2Check = p2State.check;
    newBoardState.player2Checkmate = p2State.checkmate;
    return newBoardState;
  }
}

interface PieceColorState {
  check: boolean;
  checkmate: boolean;
}

export function computePlayerState(board: MBoard,
                                  playerSide: MBSPieceSide,
                                  playerPossibleMoves: MBoardPossibleMove[],
                                  opponentPossibleMoves: MBoardPossibleMove[]): PieceColorState {
  const opponentSide = (playerSide === MBSPieceSide.Player1 ? MBSPieceSide.Player2 : MBSPieceSide.Player1);

  // - a player is in check state if any of the opponent's possible moves takes his king
  // - a player is in checkmate state if all of his possible moves still leaves him in a check state

  const check = opponentPossibleMoves.some(m => m.take?.kind === MBSPieceKind.King);

  let checkmate = true;
  for (const move of playerPossibleMoves) {
    const nextBoard = board.cloneWithMove(move);
    const nextOpponentPossibleMoves = nextBoard.getAllPiecesWithPossibleMoves(opponentSide).flatMap(p => p.possibleMoves);
    if (!nextOpponentPossibleMoves.some(m => m.take?.kind === MBSPieceKind.King)) {
      checkmate = false; // at least one move is possible without taking the king -> not in checkmate
      break;
    }
  }

  return { check: check, checkmate: checkmate };
}
