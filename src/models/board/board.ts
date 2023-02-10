import * as boardInit from './board-init';
import * as boardMoves from './board-moves';
import * as boardRepresentation from './board-representation';
import { MBSPiece, MBSPieceSide, MBSPieceKind, MBoardSquare } from './board-square';

type MBoardPieceCallback = (piece: MBSPiece, square: MBoardSquare, index: boardRepresentation.MSquareIndex) => void;

interface MPieceWithPossibleMoves {
  square: MBoardSquare;
  possibleMoves: boardMoves.MBoardPossibleMove[];
}

export class MBoard {
  public rowCount: number;
  public columnCount: number;
  public squares: MBoardSquare[][];

  public constructor(other?: MBoard) {
    this.rowCount = (other !== undefined ? other.rowCount : 8);
    this.columnCount = (other !== undefined ? other.columnCount : 8);

    // we allocate squares in a 2-dim array so that 1st index is the column and the 2nd is the row
    //
    // column index  0    1    2    3    4    5    6    7
    //             +----+----+----+----+----+----+----+----+
    // row index 0 | a1 | b1 | c1 | d1 | e1 | f1 | g1 | h1 |
    //             +----+----+----+----+----+----+----+----+
    // row index 1 | a2 | b2 | c2 | d2 | e2 | f2 | g2 | h2 |
    //             +----+----+----+----+----+----+----+----+
    // row index 2 | a3 | b3 | c3 | d3 | e3 | f3 | g3 | h3 |
    //             +----+----+----+----+----+----+----+----+
    // row index 3 | a4 | b4 | c4 | d4 | e4 | f4 | g4 | h4 |
    //             +----+----+----+----+----+----+----+----+
    // row index 4 | a5 | b5 | c5 | d5 | e5 | f5 | g5 | h5 |
    //             +----+----+----+----+----+----+----+----+
    // row index 5 | a6 | b6 | c6 | d6 | e6 | f6 | g6 | h6 |
    //             +----+----+----+----+----+----+----+----+
    // row index 6 | a7 | b7 | c7 | d7 | e7 | f7 | g7 | h7 |
    //             +----+----+----+----+----+----+----+----+
    // row index 7 | a8 | b8 | c8 | d8 | e8 | f8 | g8 | h8 |
    //             +----+----+----+----+----+----+----+----+
    //
    // so if we get squares[2][3], we get the piece at 'c4'
    // the string 'c4' is called a "code" as it matches the real board representation
    // throughout the app, we only deal with codes, array indexes are only used when dealing with the js array

    this.squares = Array(this.columnCount).fill(undefined);
    for (let ci = 0; ci < this.columnCount; ci++) {
      this.squares[ci] = Array(this.rowCount).fill(undefined);
      for (let ri = 0; ri < this.rowCount; ri++) {
        if (other !== undefined) {
          let piece: MBSPiece | undefined;
          const otherPiece = other.squares[ci][ri].piece;
          if (otherPiece !== undefined) {
            piece = new MBSPiece({
              kind: otherPiece.kind,
              side: otherPiece.side,
              code: other.squares[ci][ri].code,
              strength: otherPiece.strength
            });
          }
          this.squares[ci][ri] = { code: other.squares[ci][ri].code, piece: piece };
        } else {
          this.squares[ci][ri] = { code: boardRepresentation.indexToCode({ ci: ci, ri: ri }), piece: undefined };
        }
      }
    }
  }

  public initWithFEN(fenNotation: string): boardInit.MBoardInitPopulateWithFENResult {
    return boardInit.populateBoardWithFENNotation(this, fenNotation);
  }

  public cloneWithMove(move: boardMoves.MBoardPossibleMove): MBoard {
    const clone = new MBoard(this);
    clone.move(move);
    return clone;
  }

  public forEachPiece(callback: MBoardPieceCallback): void {
    // we iterate a1 -> a8, b1 to b8, etc.
    for (let ci = 0; ci < this.columnCount; ci++) {
      for (let ri = this.rowCount - 1; ri >= 0; ri--) {
        const square = this.squares[ci][ri];
        if (square.piece !== undefined) {
          callback(square.piece, square, { ci: ci, ri: ri });
        }
      }
    }
  }

  public squareAt(code: boardRepresentation.MSquareCode, columnMove: number = 0, rowMove: number = 0): MBoardSquare | undefined {
    if (!boardRepresentation.isValidCode(code, this.columnCount, this.rowCount)) {
      return undefined;
    }
    const codeToUse = boardRepresentation.codeWithMove(code, columnMove, rowMove);
    const index = boardRepresentation.codeToIndex(codeToUse);
    return this.squares[index.ci][index.ri];
  }

  public pieceAt(code: boardRepresentation.MSquareCode, columnMove: number = 0, rowMove: number = 0): MBSPiece | undefined {
    return this.squareAt(code, columnMove, rowMove)?.piece;
  }

  public move(move: boardMoves.MBoardPossibleMove): void {
    const squareFrom = this.squareAt(move.from);
    if (squareFrom === undefined) {
      return;
    }
    const squareTo = this.squareAt(move.to);
    if (squareTo === undefined) {
      return;
    }

    if (move.takenPiece !== undefined) {
      const squareToRemove = this.squareAt(move.takenPiece.code);
      if (squareToRemove !== undefined) {
        squareToRemove.piece = undefined;
      }
    }

    squareTo.piece = move.fromPiece;
    move.fromPiece.code = squareTo.code;
    move.fromPiece.moveCount++;

    squareFrom.piece = undefined;
  }

  public setSquare(code: boardRepresentation.MSquareCode, kind: MBSPieceKind, side: MBSPieceSide, strength: number): void {
    if (!boardRepresentation.isValidCode(code, this.columnCount, this.rowCount)) {
      throw new Error(`invalid code '${code}'`);
    }
    const index = boardRepresentation.codeToIndex(code);
    this.squares[index.ci][index.ri] = {
      code: code,
      piece: new MBSPiece({
        kind: kind,
        side: side,
        code: code,
        strength: strength
      })
    };
  }

  public getAllPiecesWithPossibleMoves(side: MBSPieceSide): MPieceWithPossibleMoves[] {
    const allPieces: MBoardSquare[] = [];
    this.forEachPiece((piece, square) => {
      if (piece.side === side) {
        allPieces.push(square);
      }
    });
    return allPieces
      .map(p => ({ square: p, possibleMoves: boardMoves.computePossibleMoves(this, { from: p.code }) }) as MPieceWithPossibleMoves)
      .filter(p => p.possibleMoves.length > 0);
  }
}
