import { BoardModel } from './board.model';
import { PieceColor, PieceKind } from './square.model';

export namespace BoardInitModel {
  const bishopPoints = 3;
  const kingPoints = 0; // 100
  const knightPoints = 3;
  const pawnPoints = 1;
  const queenPoints = 9;
  const rookPoints = 5;

  export function populateBoard(board: BoardModel): void {
    // white are at bottom of the board
    // black are at top of the board

    // board.setSquare('a1', PieceKind.King, PieceColor.White, 0);
    // board.setSquare('c2', PieceKind.Queen, PieceColor.Black, 0);

    board.setSquare('a1', PieceKind.Rook, PieceColor.White, rookPoints);
    board.setSquare('b1', PieceKind.Knight, PieceColor.White, knightPoints);
    board.setSquare('c1', PieceKind.Bishop, PieceColor.White, bishopPoints);
    board.setSquare('d1', PieceKind.Queen, PieceColor.White, queenPoints);
    board.setSquare('e1', PieceKind.King, PieceColor.White, kingPoints);
    board.setSquare('f1', PieceKind.Bishop, PieceColor.White, bishopPoints);
    board.setSquare('g1', PieceKind.Knight, PieceColor.White, knightPoints);
    board.setSquare('h1', PieceKind.Rook, PieceColor.White, rookPoints);
    board.setSquare('a2', PieceKind.Pawn, PieceColor.White, pawnPoints);
    board.setSquare('b2', PieceKind.Pawn, PieceColor.White, pawnPoints);
    board.setSquare('c2', PieceKind.Pawn, PieceColor.White, pawnPoints);
    board.setSquare('d2', PieceKind.Pawn, PieceColor.White, pawnPoints);
    board.setSquare('e2', PieceKind.Pawn, PieceColor.White, pawnPoints);
    board.setSquare('f2', PieceKind.Pawn, PieceColor.White, pawnPoints);
    board.setSquare('g2', PieceKind.Pawn, PieceColor.White, pawnPoints);
    board.setSquare('h2', PieceKind.Pawn, PieceColor.White, pawnPoints);

    board.setSquare('a8', PieceKind.Rook, PieceColor.Black, -rookPoints);
    board.setSquare('b8', PieceKind.Knight, PieceColor.Black, -knightPoints);
    board.setSquare('c8', PieceKind.Bishop, PieceColor.Black, -bishopPoints);
    board.setSquare('d8', PieceKind.Queen, PieceColor.Black, -queenPoints);
    board.setSquare('e8', PieceKind.King, PieceColor.Black, -kingPoints);
    board.setSquare('f8', PieceKind.Bishop, PieceColor.Black, -bishopPoints);
    board.setSquare('g8', PieceKind.Knight, PieceColor.Black, -knightPoints);
    board.setSquare('h8', PieceKind.Rook, PieceColor.Black, -rookPoints);
    board.setSquare('a7', PieceKind.Pawn, PieceColor.Black, -pawnPoints);
    board.setSquare('b7', PieceKind.Pawn, PieceColor.Black, -pawnPoints);
    board.setSquare('c7', PieceKind.Pawn, PieceColor.Black, -pawnPoints);
    board.setSquare('d7', PieceKind.Pawn, PieceColor.Black, -pawnPoints);
    board.setSquare('e7', PieceKind.Pawn, PieceColor.Black, -pawnPoints);
    board.setSquare('f7', PieceKind.Pawn, PieceColor.Black, -pawnPoints);
    board.setSquare('g7', PieceKind.Pawn, PieceColor.Black, -pawnPoints);
    board.setSquare('h7', PieceKind.Pawn, PieceColor.Black, -pawnPoints);
  }
}
