import { BoardRepresentationModel } from './board-representation.model';
import { BoardModel } from './board.model';
import { PieceColor, PieceKind } from './square.model';

export namespace BoardInitModel {
  const bishopPoints = 3;
  const kingPoints = 0; // 100
  const knightPoints = 3;
  const pawnPoints = 1;
  const queenPoints = 9;
  const rookPoints = 5;

  export function populateBoardWithFENNotation(board: BoardModel, fen: string): void {
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
          const code = BoardRepresentationModel.indexToCode(ci, ri);
          switch (c) {
            case 'B': board.setSquare(code, PieceKind.Bishop, PieceColor.White, bishopPoints); break;
            case 'K': board.setSquare(code, PieceKind.King, PieceColor.White, kingPoints); break;
            case 'N': board.setSquare(code, PieceKind.Knight, PieceColor.White, knightPoints); break;
            case 'P': board.setSquare(code, PieceKind.Pawn, PieceColor.White, pawnPoints); break;
            case 'Q': board.setSquare(code, PieceKind.Queen, PieceColor.White, queenPoints); break;
            case 'R': board.setSquare(code, PieceKind.Rook, PieceColor.White, rookPoints); break;
            case 'b': board.setSquare(code, PieceKind.Bishop, PieceColor.Black, -bishopPoints); break;
            case 'k': board.setSquare(code, PieceKind.King, PieceColor.Black, -kingPoints); break;
            case 'n': board.setSquare(code, PieceKind.Knight, PieceColor.Black, -knightPoints); break;
            case 'p': board.setSquare(code, PieceKind.Pawn, PieceColor.Black, -pawnPoints); break;
            case 'q': board.setSquare(code, PieceKind.Queen, PieceColor.Black, -queenPoints); break;
            case 'r': board.setSquare(code, PieceKind.Rook, PieceColor.Black, -rookPoints); break;
          }
          ci++;
        }
      }
      ri++;
    }
    const turn = fields[1];
    switch (turn) {
      case 'w': board.turn = PieceColor.White; break;
      case 'b': board.turn = PieceColor.Black; break;
    }
  }
}
