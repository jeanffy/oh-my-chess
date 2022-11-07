import { BoardAIPlayerStrategyHelper } from './board-ai-player-strategies/board-ai-player-strategy.helper';
import { BoardInitModel } from './board-init.model';
import { BoardMovesModel } from './board-moves.model';
import { BoardRepresentationModel, CodeMove, SquareCode, SquareIndex } from './board-representation.model';
import { Piece, PieceColor, PieceKind, SquareModel } from './square.model';

export interface BoardMaterialScores {
  white: number;
  black: number;
}

export interface BoardMove {
  from: SquareCode;
  to: SquareCode;
  take?: Piece;
}

export type BoardSquareCallback = (square: SquareModel, index: SquareIndex) => void;

export interface BoardGameState {
  pat: false;
  whiteCheck: boolean;
  whiteMat: boolean;
  blackCheck: boolean;
  blackMat: boolean;
}

export class BoardModel {
  public rowCount = 8;
  public columnCount = 8;
  public squares: SquareModel[][];

  public constructor() {
    BoardRepresentationModel.init(this.columnCount, this.rowCount);

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
        this.squares[ci][ri] = { code: BoardRepresentationModel.indexToCode(ci, ri), piece: undefined };
      }
    }

    BoardInitModel.populateBoard(this);
  }

  public forEachSquare(callback: BoardSquareCallback): void {
    for (let ci = 0; ci < this.columnCount; ci++) {
      for (let ri = 0; ri < this.rowCount; ri++) {
        callback(this.squares[ci][ri], new SquareIndex(ci, ri));
      }
    }
  }

  public squareAt(code: SquareCode, cm: number = 0, rm: number = 0): SquareModel {
    const codeToUse = BoardRepresentationModel.codeWithMove(code, cm, rm);
    const index = BoardRepresentationModel.codeToIndex(codeToUse);
    return this.squares[index.ci][index.ri];
  }

  public squareAtEx(this: BoardModel, code: SquareCode, codeMove: CodeMove): SquareModel {
    return this.squareAt(code, codeMove.cm, codeMove.rm);
  }

  public validMoves = BoardMovesModel.validMoves;

  public move(move: BoardMove): Piece | undefined {
    const squareFrom = this.squareAt(move.from);
    if (squareFrom.piece === undefined) {
      return undefined;
    }

    let taken: Piece | undefined;

    const squareTo = this.squareAt(move.to);
    if (squareTo.piece !== undefined) {
      taken = squareFrom.piece;
    }

    squareTo.piece = squareFrom.piece;
    squareTo.piece.firstMove = false;
    squareFrom.piece = undefined;
  }

  public setSquare(code: SquareCode, kind: PieceKind, color: PieceColor, strength: number): void {
    const index = BoardRepresentationModel.codeToIndex(code);
    if (!BoardRepresentationModel.isValidIndex(index)) {
      throw new Error(`invalid code '${code}'`);
    }
    this.squares[index.ci][index.ri] = {
      code: code,
      piece: {
        kind: kind,
        color: color,
        strength: strength,
        firstMove: true
      }
    };
  }

  public getMaterialScores(): BoardMaterialScores {
    const scores: BoardMaterialScores = { white: 0, black: 0 };
    this.forEachSquare(square => {
      if (square.piece !== undefined) {
        switch (square.piece.color) {
          case PieceColor.White: scores.white += square.piece.strength; break;
          case PieceColor.Black: scores.black += square.piece.strength; break;
        }
      }
    });
    return scores;
  }

  public computeGameState(): BoardGameState {
    const whitePiecesThatCanMove = BoardAIPlayerStrategyHelper.getAllPiecesWithValidMoves(this, PieceColor.White);
    const whitePiecesThatCanTakeBlackKing = whitePiecesThatCanMove.filter(p => p.validMoves.some(m => m.take !== undefined && m.take.kind === PieceKind.King));
    const blackPiecesThatCanMove = BoardAIPlayerStrategyHelper.getAllPiecesWithValidMoves(this, PieceColor.Black);
    const blackPiecesThatCanTakeBlackKing = blackPiecesThatCanMove.filter(p => p.validMoves.some(m => m.take !== undefined && m.take.kind === PieceKind.King));
    return {
      pat: false,
      whiteCheck: (blackPiecesThatCanTakeBlackKing.length > 0),
      whiteMat: false,
      blackCheck: (whitePiecesThatCanTakeBlackKing.length > 0),
      blackMat: false
    };
  }
}
