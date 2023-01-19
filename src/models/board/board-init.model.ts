import { MBoardRepresentation } from './board-representation.model';
import { MBoard } from './board.model';
import { MPieceSide, MPieceKind } from './square.model';

export interface MBoardInitPopulateWithFENResult {
  turn: MPieceSide;
}

export namespace MBoardInit {
  const bishopPoints = 3;
  const kingPoints = 0; // 100
  const knightPoints = 3;
  const pawnPoints = 1;
  const queenPoints = 9;
  const rookPoints = 5;

  export function populateBoardWithFENNotation(board: MBoard, fen: string): MBoardInitPopulateWithFENResult {
    const fields = fen.split(' ');
    let ci = 0;
    let ri = 0;
    const fenLines = fields[0].split('/');
    for (const fenLine of fenLines) {
      ci = 0;
      const chars = fenLine.split('');
      for (const c of chars) {
        if (!isNaN(Number.parseInt(c))) {
          ci += Number.parseInt(c);
        } else {
          const code = MBoardRepresentation.indexToCode(ci, ri);
          switch (c) {
            case 'B': board.setSquare(code, MPieceKind.Bishop, MPieceSide.Player1, bishopPoints); break;
            case 'K': board.setSquare(code, MPieceKind.King, MPieceSide.Player1, kingPoints); break;
            case 'N': board.setSquare(code, MPieceKind.Knight, MPieceSide.Player1, knightPoints); break;
            case 'P': board.setSquare(code, MPieceKind.Pawn, MPieceSide.Player1, pawnPoints); break;
            case 'Q': board.setSquare(code, MPieceKind.Queen, MPieceSide.Player1, queenPoints); break;
            case 'R': board.setSquare(code, MPieceKind.Rook, MPieceSide.Player1, rookPoints); break;
            case 'b': board.setSquare(code, MPieceKind.Bishop, MPieceSide.Player2, -bishopPoints); break;
            case 'k': board.setSquare(code, MPieceKind.King, MPieceSide.Player2, -kingPoints); break;
            case 'n': board.setSquare(code, MPieceKind.Knight, MPieceSide.Player2, -knightPoints); break;
            case 'p': board.setSquare(code, MPieceKind.Pawn, MPieceSide.Player2, -pawnPoints); break;
            case 'q': board.setSquare(code, MPieceKind.Queen, MPieceSide.Player2, -queenPoints); break;
            case 'r': board.setSquare(code, MPieceKind.Rook, MPieceSide.Player2, -rookPoints); break;
          }
          ci++;
        }
      }
      ri++;
    }
    const turn = fields[1];

    const result: MBoardInitPopulateWithFENResult = {
      turn: MPieceSide.Player1
    }

    switch (turn) {
      case 'w': result.turn = MPieceSide.Player1; break;
      case 'b': result.turn = MPieceSide.Player2; break;
    }

    return result;
  }
}
