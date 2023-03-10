import { MGame } from './game';
import { MBSPieceKind, MBSPieceSide } from '../board/board-square';
import { MBMoveKind } from '../board/board-moves';

export class MGameNotations {
  public fen: string;

  public constructor(other?: Partial<MGameNotations>) {
    this.fen = (other?.fen !== undefined ? other.fen : '');
  }

  public static createFromGame(game: MGame): MGameNotations {
    const notations = new MGameNotations();
    notations.fen = getFENNotation(game);
    return notations;
  }
}

function getFENNotation(game: MGame): string {
  // based on https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation
  // see also https://ia802908.us.archive.org/26/items/pgn-standard-1994-03-12/PGN_standard_1994-03-12.txt (chapter 16.1: FEN)
  let fen = '';
  const fenLines: string[] = [];
  for (let ri = game.board.rowCount - 1; ri >= 0; ri--) {
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
          case MBSPieceSide.Player1:
            switch (square.piece.kind) {
              case MBSPieceKind.Bishop: fenLine += 'B'; break;
              case MBSPieceKind.King: fenLine += 'K'; break;
              case MBSPieceKind.Knight: fenLine += 'N'; break;
              case MBSPieceKind.Pawn: fenLine += 'P'; break;
              case MBSPieceKind.Queen: fenLine += 'Q'; break;
              case MBSPieceKind.Rook: fenLine += 'R'; break;
            }
            break;
          case MBSPieceSide.Player2:
            switch (square.piece.kind) {
              case MBSPieceKind.Bishop: fenLine += 'b'; break;
              case MBSPieceKind.King: fenLine += 'k'; break;
              case MBSPieceKind.Knight: fenLine += 'n'; break;
              case MBSPieceKind.Pawn: fenLine += 'p'; break;
              case MBSPieceKind.Queen: fenLine += 'q'; break;
              case MBSPieceKind.Rook: fenLine += 'r'; break;
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

  switch (game.state.turn) {
    case MBSPieceSide.Player1: fen += 'w'; break;
    case MBSPieceSide.Player2: fen += 'b'; break;
  }
  fen += ' ';

  fen += '(cs)';
  fen += ' ';

  const lastMove = game.state.getLastMove();
  if (lastMove !== undefined && lastMove.moveKind === MBMoveKind.PawnAdvanceTwoSquares) {
    fen += lastMove.to;
  } else {
    fen += '-';
  }
  fen += ' ';

  fen += `${game.state.halfMoves}`;
  fen += ' ';

  fen += `${game.state.fullMoves}`;

  return fen;
}
