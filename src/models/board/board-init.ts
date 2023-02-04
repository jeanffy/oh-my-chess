import * as boardRepresentation from './board-representation';
import { MBoard } from './board';
import { MBSPieceSide, MBSPieceKind } from './board-square';

export interface MBoardInitPopulateWithFENResult {
  turn: MBSPieceSide;
}

const bishopPoints = 3;
const kingPoints = 0; // 100
const knightPoints = 3;
const pawnPoints = 1;
const queenPoints = 9;
const rookPoints = 5;

export function populateBoardWithFENNotation(board: MBoard, fen: string): MBoardInitPopulateWithFENResult {
  const fields = fen.split(' ');
  let ci = 0;
  let ri = 7; // fen notation goes from row 8 to row 1, so our starting index is 7
  const fenLines = fields[0].split('/');
  for (const fenLine of fenLines) {
    ci = 0;
    const chars = fenLine.split('');
    for (const c of chars) {
      if (!isNaN(Number.parseInt(c))) {
        ci += Number.parseInt(c);
      } else {
        const code = boardRepresentation.indexToCode({ ci: ci, ri: ri });
        switch (c) {
          case 'B': board.setSquare(code, MBSPieceKind.Bishop, MBSPieceSide.Player1, bishopPoints); break;
          case 'K': board.setSquare(code, MBSPieceKind.King, MBSPieceSide.Player1, kingPoints); break;
          case 'N': board.setSquare(code, MBSPieceKind.Knight, MBSPieceSide.Player1, knightPoints); break;
          case 'P': board.setSquare(code, MBSPieceKind.Pawn, MBSPieceSide.Player1, pawnPoints); break;
          case 'Q': board.setSquare(code, MBSPieceKind.Queen, MBSPieceSide.Player1, queenPoints); break;
          case 'R': board.setSquare(code, MBSPieceKind.Rook, MBSPieceSide.Player1, rookPoints); break;
          case 'b': board.setSquare(code, MBSPieceKind.Bishop, MBSPieceSide.Player2, -bishopPoints); break;
          case 'k': board.setSquare(code, MBSPieceKind.King, MBSPieceSide.Player2, -kingPoints); break;
          case 'n': board.setSquare(code, MBSPieceKind.Knight, MBSPieceSide.Player2, -knightPoints); break;
          case 'p': board.setSquare(code, MBSPieceKind.Pawn, MBSPieceSide.Player2, -pawnPoints); break;
          case 'q': board.setSquare(code, MBSPieceKind.Queen, MBSPieceSide.Player2, -queenPoints); break;
          case 'r': board.setSquare(code, MBSPieceKind.Rook, MBSPieceSide.Player2, -rookPoints); break;
        }
        ci++;
      }
    }
    ri--;
  }
  const turn = fields[1];

  const result: MBoardInitPopulateWithFENResult = {
    turn: MBSPieceSide.Player1
  }

  switch (turn) {
    case 'w': result.turn = MBSPieceSide.Player1; break;
    case 'b': result.turn = MBSPieceSide.Player2; break;
  }

  return result;
}
