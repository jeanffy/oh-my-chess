import { BoardModel } from './board.model';
import { PieceSide, PieceKind } from '../square.model';

export namespace BoardNotationsModel {
  export function getFENNotation(board: BoardModel): string {
    // based on https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
    let fen = '';
    const fenLines: string[] = [];
    for (let ri = 0; ri < board.rowCount; ri++) {
      let fenLine = '';
      let numberOfEmpty = 0;
      for (let ci = 0; ci < board.columnCount; ci++) {
        const square = board.squares[ci][ri];
        if (square.piece === undefined) {
          numberOfEmpty++;
        } else {
          if (numberOfEmpty > 0) {
            fenLine += `${numberOfEmpty}`;
            numberOfEmpty = 0;
          }
          switch (square.piece.side) {
            case PieceSide.Player1:
              switch (square.piece.kind) {
                case PieceKind.Bishop: fenLine += 'B'; break;
                case PieceKind.King: fenLine += 'K'; break;
                case PieceKind.Knight: fenLine += 'N'; break;
                case PieceKind.Pawn: fenLine += 'P'; break;
                case PieceKind.Queen: fenLine += 'Q'; break;
                case PieceKind.Rook: fenLine += 'R'; break;
              }
              break;
            case PieceSide.Player2:
              switch (square.piece.kind) {
                case PieceKind.Bishop: fenLine += 'b'; break;
                case PieceKind.King: fenLine += 'k'; break;
                case PieceKind.Knight: fenLine += 'n'; break;
                case PieceKind.Pawn: fenLine += 'p'; break;
                case PieceKind.Queen: fenLine += 'q'; break;
                case PieceKind.Rook: fenLine += 'r'; break;
              }
              break;
          }
        }
      }
      if (numberOfEmpty > 0) {
        fenLine += `${numberOfEmpty}`;
      }
      fenLines.push(fenLine);
    }
    fen += fenLines.join('/');
    fen += ' ';
    switch (board.turn) {
      case PieceSide.Player1: fen += 'w'; break;
      case PieceSide.Player2: fen += 'b'; break;
    }
    fen += ' ';
    fen += '(cs)';
    fen += ' ';
    fen += '(ep)';
    fen += ' ';
    fen += `${board.halfMoves}`;
    fen += ' ';
    fen += `${board.fullMoves}`;
    return fen;
  }
}
