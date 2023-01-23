// a SquareCode is a standard notation, like 'a1' or 'c8'
// columns go from 'a' to 'h', rows go from '1' to '8'
export type MSquareCode = string;

// a SquareIndex represents aboluste square indexes in array (2-dim)
// columns and rows go from 0 to 7
// column of index 0 corresponds to column 'a' in standard notation
// column of index 7 corresponds to column 'h' in standard notation
// row of index 0 corresponds to row '8' in standard notation
// row of index 7 corresponds to row '1' in standard notation
export class MSquareIndex {
  public ci: number;
  public ri: number;

  public constructor(columnIndex: number, rowIndex: number) {
    this.ci = columnIndex;
    this.ri = rowIndex;
  }
}

// a CodeMove represents a relative move of a piece on the board, using standard notation
// if a piece is at 'c5':
// - { cm: 1, rm: 2 } moves the piece to 'd7', which is index { ci: 3, ri: 1 }
// - { cm: -1, rm: -2 } moves the piece to 'b3', which is index { ci: 1, ri: 5 }
export class MCodeMove {
  public cm: number;
  public rm: number;

  public constructor(columnMove: number, rowMove: number) {
    this.cm = columnMove;
    this.rm = rowMove;
  }
}

export namespace MBoardRepresentation {
  let columnCount: number = 0;
  let rowCount: number = 0;

  export function init(columns: number, rows: number): void {
    columnCount = columns;
    rowCount = rows;
  }

  export function isValidIndex(index: MSquareIndex): boolean {
    if (index.ci < 0 || index.ci > columnCount - 1) {
      return false;
    }
    if (index.ri < 0 || index.ri > rowCount - 1) {
      return false;
    }
    return true;
  }

  export function isValidCode(code: MSquareCode): boolean {
    if (code.length !== 2) {
      return false;
    }
    const index = codeToIndex(code);
    return isValidIndex(index);
  }

  export function codeToIndex(code: MSquareCode): MSquareIndex {
    const codeColumn = code[0];
    const codeRow = code[1];
    const ci = codeColumn.charCodeAt(0) - 'a'.charCodeAt(0);
    const ri = rowCount - Number(codeRow);
    return new MSquareIndex(ci, ri);
  }

  export function indexToCode(ci: number, ri: number): MSquareCode {
    const column = String.fromCharCode('a'.charCodeAt(0) + ci);
    const row = rowCount - ri;
    return `${column}${row}`;
  }

  export function indexToCodeEx(index: MSquareIndex): MSquareCode {
    return indexToCode(index.ci, index.ri);
  }

  export function codeWithMove(code: MSquareCode, cm: number, rm: number): MSquareCode {
    const index = codeToIndex(code);
    return indexToCode(index.ci + cm, index.ri - rm);
  }

  export function codeWithMoveEx(code: MSquareCode, codeMove: MCodeMove): MSquareCode {
    return codeWithMove(code, codeMove.cm, codeMove.rm);
  }
}
