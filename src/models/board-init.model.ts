import { BoardRepresentationModel } from './board-representation.model';
import { BoardModel } from './board.model';
import { PieceSide, PieceKind } from './square.model';

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
            case 'B': board.setSquare(code, PieceKind.Bishop, PieceSide.P1, bishopPoints); break;
            case 'K': board.setSquare(code, PieceKind.King, PieceSide.P1, kingPoints); break;
            case 'N': board.setSquare(code, PieceKind.Knight, PieceSide.P1, knightPoints); break;
            case 'P': board.setSquare(code, PieceKind.Pawn, PieceSide.P1, pawnPoints); break;
            case 'Q': board.setSquare(code, PieceKind.Queen, PieceSide.P1, queenPoints); break;
            case 'R': board.setSquare(code, PieceKind.Rook, PieceSide.P1, rookPoints); break;
            case 'b': board.setSquare(code, PieceKind.Bishop, PieceSide.P2, -bishopPoints); break;
            case 'k': board.setSquare(code, PieceKind.King, PieceSide.P2, -kingPoints); break;
            case 'n': board.setSquare(code, PieceKind.Knight, PieceSide.P2, -knightPoints); break;
            case 'p': board.setSquare(code, PieceKind.Pawn, PieceSide.P2, -pawnPoints); break;
            case 'q': board.setSquare(code, PieceKind.Queen, PieceSide.P2, -queenPoints); break;
            case 'r': board.setSquare(code, PieceKind.Rook, PieceSide.P2, -rookPoints); break;
          }
          ci++;
        }
      }
      ri++;
    }
    const turn = fields[1];
    switch (turn) {
      case 'w': board.turn = PieceSide.P1; break;
      case 'b': board.turn = PieceSide.P2; break;
    }
  }
}
