import { MGame } from './game.model';
import { MPieceKind, MPieceSide } from '../board/square.model';

export class MGameNotations {
  public fen: string;

  public constructor(other?: Partial<MGameNotations>) {
    this.fen = (other?.fen !== undefined ? other.fen : '');
  }

  public static createFromGame(game: MGame): MGameNotations {
    const o = new MGameNotations();
    o.fen = MGameNotationsHelper.getFENNotation(game);
    return o;
  }
}

namespace MGameNotationsHelper {
  export function getFENNotation(game: MGame): string {
    // based on https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
    let fen = '';
    const fenLines: string[] = [];
    for (let ri = 0; ri < game.board.rowCount; ri++) {
      let fenLine = '';
      let numberOfEmpty = 0;
      for (let ci = 0; ci < game.board.columnCount; ci++) {
        const square = game.board.squares[ci][ri];
        if (square.piece === undefined) {
          numberOfEmpty++;
        } else {
          if (numberOfEmpty > 0) {
            fenLine += `${numberOfEmpty}`;
            numberOfEmpty = 0;
          }
          switch (square.piece.side) {
            case MPieceSide.Player1:
              switch (square.piece.kind) {
                case MPieceKind.Bishop: fenLine += 'B'; break;
                case MPieceKind.King: fenLine += 'K'; break;
                case MPieceKind.Knight: fenLine += 'N'; break;
                case MPieceKind.Pawn: fenLine += 'P'; break;
                case MPieceKind.Queen: fenLine += 'Q'; break;
                case MPieceKind.Rook: fenLine += 'R'; break;
              }
              break;
            case MPieceSide.Player2:
              switch (square.piece.kind) {
                case MPieceKind.Bishop: fenLine += 'b'; break;
                case MPieceKind.King: fenLine += 'k'; break;
                case MPieceKind.Knight: fenLine += 'n'; break;
                case MPieceKind.Pawn: fenLine += 'p'; break;
                case MPieceKind.Queen: fenLine += 'q'; break;
                case MPieceKind.Rook: fenLine += 'r'; break;
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
    switch (game.info.turn) {
      case MPieceSide.Player1: fen += 'w'; break;
      case MPieceSide.Player2: fen += 'b'; break;
    }
    fen += ' ';
    fen += '(cs)';
    fen += ' ';
    fen += '(ep)';
    fen += ' ';
    fen += `${game.info.halfMoves}`;
    fen += ' ';
    fen += `${game.info.fullMoves}`;
    return fen;
  }
}
