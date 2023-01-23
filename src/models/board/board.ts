import { MBoardInit, MBoardInitPopulateWithFENResult } from './board-init';
import { MBoardMove, MBoardMoves, MBoardValidMove as BoardPossibleMove } from './board-moves';
import { MBoardRepresentation, MCodeMove, MSquareCode, MSquareIndex } from './board-representation';
import { MBSPiece, MBSPieceSide, MBSPieceKind, MBoardSquare } from './board-square';

export class MBoardMaterialScores {
  public player1: number;
  public player2: number;

  public constructor(other?: Partial<MBoardMaterialScores>) {
    this.player1 = (other?.player1 !== undefined ? other.player1 : 0);
    this.player2 = (other?.player2 !== undefined ? other.player2 : 0);
  }

  public static createFromBoard(board: MBoard): MBoardMaterialScores {
    const o = new MBoardMaterialScores({ player1: 0, player2: 0 });
    board.forEachSquare(square => {
      if (square.piece !== undefined) {
        switch (square.piece.side) {
          case MBSPieceSide.Player1: o.player1 += square.piece.strength; break;
          case MBSPieceSide.Player2: o.player2 += square.piece.strength; break;
        }
      }
    });
    return o;
  }
}

export type MBoardSquareCallback = (square: MBoardSquare, index: MSquareIndex) => void;

export interface MPieceWithPossibleMoves {
  square: MBoardSquare;
  possibleMoves: BoardPossibleMove[];
}

export class MBoard {
  public rowCount: number;
  public columnCount: number;
  public squares: MBoardSquare[][];

  public constructor(other?: MBoard) {
    this.rowCount = (other !== undefined ? other.rowCount : 8);
    this.columnCount = (other !== undefined ? other.columnCount : 8);

    MBoardRepresentation.init(this.columnCount, this.rowCount);

    // we allocate squares in a 2-dim array so that 1st index is the column and the 2nd is the row
    //
    // column index  0    1    2    3    4    5    6    7
    //             +----+----+----+----+----+----+----+----+
    // row index 0 | a8 | b8 | c8 | d8 | e8 | f8 | g8 | h8 |
    //             +----+----+----+----+----+----+----+----+
    // row index 1 | a7 | b7 | c7 | d7 | e7 | f7 | g7 | h7 |
    //             +----+----+----+----+----+----+----+----+
    // row index 2 | a6 | b6 | c6 | d6 | e6 | f6 | g6 | h6 |
    //             +----+----+----+----+----+----+----+----+
    // row index 3 | a5 | b5 | c5 | d5 | e5 | f5 | g5 | h5 |
    //             +----+----+----+----+----+----+----+----+
    // row index 4 | a4 | b4 | c4 | d4 | e4 | f4 | g4 | h4 |
    //             +----+----+----+----+----+----+----+----+
    // row index 5 | a3 | b3 | c3 | d3 | e3 | f3 | g3 | h3 |
    //             +----+----+----+----+----+----+----+----+
    // row index 6 | a2 | b2 | c2 | d2 | e2 | f2 | g2 | h2 |
    //             +----+----+----+----+----+----+----+----+
    // row index 7 | a1 | b1 | c1 | d1 | e1 | f1 | g1 | h1 |
    //             +----+----+----+----+----+----+----+----+
    //
    // so if we get squares[2][3], we get the piece at 'c5'
    // - tuple { ci: 2, ri: 3 } is called an "index" as it represents the column and row index in the 2-dim array
    // - the string 'c5' is called a "code" as it matches the real board representation

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
              strength: otherPiece.strength
            });
          }
          this.squares[ci][ri] = { code: other.squares[ci][ri].code, piece: piece };
        } else {
          this.squares[ci][ri] = { code: MBoardRepresentation.indexToCode(ci, ri), piece: undefined };
        }
      }
    }
  }

  public initWithFEN(fenNotation: string): MBoardInitPopulateWithFENResult {
    return MBoardInit.populateBoardWithFENNotation(this, fenNotation);
  }

  public cloneWithMove(move: MBoardMove): MBoard {
    const clone = new MBoard(this);
    clone.move(move);
    return clone;
  }

  public forEachSquare(callback: MBoardSquareCallback): void {
    for (let ci = 0; ci < this.columnCount; ci++) {
      for (let ri = 0; ri < this.rowCount; ri++) {
        callback(this.squares[ci][ri], new MSquareIndex(ci, ri));
      }
    }
  }

  public squareAt(code: MSquareCode, cm: number = 0, rm: number = 0): MBoardSquare {
    const codeToUse = MBoardRepresentation.codeWithMove(code, cm, rm);
    const index = MBoardRepresentation.codeToIndex(codeToUse);
    return this.squares[index.ci][index.ri];
  }

  public squareAtEx(code: MSquareCode, codeMove: MCodeMove): MBoardSquare {
    return this.squareAt(code, codeMove.cm, codeMove.rm);
  }

  public move(move: MBoardMove): MBSPiece | undefined {
    let takenPiece: MBSPiece | undefined;

    const squareTo = this.squareAt(move.to);
    if (squareTo.piece !== undefined) {
      takenPiece = squareTo.piece;
    }

    squareTo.piece = move.fromPiece;
    const squareFrom = this.squareAt(move.from);
    squareFrom.piece = undefined;

    return takenPiece;
  }

  public setSquare(code: MSquareCode, kind: MBSPieceKind, color: MBSPieceSide, strength: number): void {
    const index = MBoardRepresentation.codeToIndex(code);
    if (!MBoardRepresentation.isValidIndex(index)) {
      throw new Error(`invalid code '${code}'`);
    }
    this.squares[index.ci][index.ri] = {
      code: code,
      piece: new MBSPiece({
        kind: kind,
        side: color,
        strength: strength
      })
    };
  }

  public getAllPiecesWithPossibleMoves(color: MBSPieceSide): MPieceWithPossibleMoves[] {
    const allPieces: MBoardSquare[] = [];
    this.forEachSquare(square => {
      if (square.piece !== undefined && square.piece.side === color) {
        allPieces.push(square);
      }
    });
    return allPieces
      .map(p => ({ square: p, possibleMoves: MBoardMoves.possibleMoves(this, { from: p.code }) }) as MPieceWithPossibleMoves)
      .filter(p => p.possibleMoves.length > 0);
  }
}
