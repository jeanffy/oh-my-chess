import { BoardInitModel } from './board-init.model';
import { BoardMove, BoardMovesModel, BoardValidMove as BoardPossibleMove } from './board-moves.model';
import { BoardNotationsModel } from './board-notations.model';
import { BoardRepresentationModel, CodeMove, SquareCode, SquareIndex } from './board-representation.model';
import { BoardState, BoardStateModel } from './board-state.model';
import { Piece, PieceSide, PieceKind, SquareModel } from '../square.model';

export interface BoardMaterialScores {
  player1: number;
  player2: number;
}

export type BoardSquareCallback = (square: SquareModel, index: SquareIndex) => void;

export interface BoardGameStateNotations {
  fen: string;
}

export interface PieceWithPossibleMoves {
  square: SquareModel;
  possibleMoves: BoardPossibleMove[];
}

export class BoardModel {
  public isClone = false;

  public rowCount: number;
  public columnCount: number;
  public squares: SquareModel[][];
  public turn: PieceSide;
  public fullMoves: number;
  public halfMoves: number;
  public gameState: BoardState;
  public gameStateNotations: BoardGameStateNotations;

  public constructor(other?: BoardModel) {
    this.rowCount = (other !== undefined ? other.rowCount : 8);
    this.columnCount = (other !== undefined ? other.columnCount : 8);

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
        if (other !== undefined) {
          let piece: Piece | undefined;
          const otherPiece = other.squares[ci][ri].piece;
          if (otherPiece !== undefined) {
            piece = {
              kind: otherPiece.kind,
              side: otherPiece.side,
              strength: otherPiece.strength
            };
          }
          this.squares[ci][ri] = { code: other.squares[ci][ri].code, piece: piece };
        } else {
          this.squares[ci][ri] = { code: BoardRepresentationModel.indexToCode(ci, ri), piece: undefined };
        }
      }
    }

    if (other !== undefined) {
      this.turn = other.turn;
      this.fullMoves = other.fullMoves;
      this.halfMoves = other.halfMoves;
      this.gameState = {
        stalemate: other.gameState.stalemate,
        player1Check: other.gameState.player1Check,
        player1Checkmate: other.gameState.player1Checkmate,
        player2Check: other.gameState.player2Check,
        player2Checkmate: other.gameState.player2Checkmate
      };
      this.gameStateNotations = {
        fen: other.gameStateNotations.fen
      };
    } else {
      this.turn = PieceSide.Player1;
      this.fullMoves = 0;
      this.halfMoves = 0;
      this.gameState = {
        stalemate: false,
        player1Check: false,
        player1Checkmate: false,
        player2Check: false,
        player2Checkmate: false,
      };
      this.gameStateNotations = {
        fen: BoardNotationsModel.getFENNotation(this)
      };
    }
  }

  public initWithFEN(fenNotation: string): void {
    BoardInitModel.populateBoardWithFENNotation(this, fenNotation);
    this.gameState = BoardStateModel.computeState(this);
    this.gameStateNotations = {
      fen: BoardNotationsModel.getFENNotation(this)
    };
  }

  public cloneWithMove(move: BoardMove): BoardModel {
    const clone = new BoardModel(this);
    clone.isClone = true;
    clone.move(move);
    return clone;
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

  public squareAtEx(code: SquareCode, codeMove: CodeMove): SquareModel {
    return this.squareAt(code, codeMove.cm, codeMove.rm);
  }

  public move(move: BoardMove): Piece | undefined {
    const squareFrom = this.squareAt(move.from);
    if (squareFrom.piece === undefined) {
      return undefined;
    }

    const movingPiece = squareFrom.piece;

    let takenPiece: Piece | undefined;

    const squareTo = this.squareAt(move.to);
    if (squareTo.piece !== undefined) {
      takenPiece = squareFrom.piece;
    }

    squareTo.piece = movingPiece;
    squareFrom.piece = undefined;

    // this.gameState is updated in a separate call

    this.turn = (this.turn === PieceSide.Player1 ? PieceSide.Player2 : PieceSide.Player1);

    if (this.turn === PieceSide.Player1) {
      this.fullMoves++;
    }

    this.halfMoves++;
    if (takenPiece !== undefined || movingPiece.kind === PieceKind.Pawn) {
      this.halfMoves = 0;
    }

    this.gameStateNotations = {
      fen: BoardNotationsModel.getFENNotation(this)
    };

    return takenPiece;
  }

  public updateState(): void {
    this.gameState = BoardStateModel.computeState(this);
  }

  public setSquare(code: SquareCode, kind: PieceKind, color: PieceSide, strength: number): void {
    const index = BoardRepresentationModel.codeToIndex(code);
    if (!BoardRepresentationModel.isValidIndex(index)) {
      throw new Error(`invalid code '${code}'`);
    }
    this.squares[index.ci][index.ri] = {
      code: code,
      piece: {
        kind: kind,
        side: color,
        strength: strength
      }
    };
  }

  public getMaterialScores(): BoardMaterialScores {
    const scores: BoardMaterialScores = { player1: 0, player2: 0 };
    this.forEachSquare(square => {
      if (square.piece !== undefined) {
        switch (square.piece.side) {
          case PieceSide.Player1: scores.player1 += square.piece.strength; break;
          case PieceSide.Player2: scores.player2 += square.piece.strength; break;
        }
      }
    });
    return scores;
  }

  public getAllPiecesWithPossibleMoves(color: PieceSide): PieceWithPossibleMoves[] {
    const allPieces: SquareModel[] = [];
    this.forEachSquare(square => {
      if (square.piece !== undefined && square.piece.side === color) {
        allPieces.push(square);
      }
    });
    return allPieces
      .map(p => ({ square: p, possibleMoves: BoardMovesModel.possibleMoves(this, { from: p.code }) }) as PieceWithPossibleMoves)
      .filter(p => p.possibleMoves.length > 0);
  }
}
