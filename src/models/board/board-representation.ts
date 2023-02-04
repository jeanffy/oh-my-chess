// a SquareCode is a standard notation, like 'a1' or 'c8'
// columns go from 'a' to 'h', rows go from '1' to '8'
export type MSquareCode = string;

export interface MSquareIndex {
  ci: number;
  ri: number;
}

const aCharCode = 'a'.charCodeAt(0);

export function extractColumn(code: MSquareCode): string {
  return code[0];
}

export function extractColumnIndex(code: MSquareCode): number {
  return (code[0].charCodeAt(0) - aCharCode);
}

export function extractRow(code: MSquareCode): number {
  return (extractRowIndex(code) + 1);
}

export function extractRowIndex(code: MSquareCode): number {
  return (Number(code[1]) - 1);
}

// 'a1' -> { ci: 0, ri: 0 }
// 'h8' -> { ci: 7, ri: 7 }
export function codeToIndex(code: MSquareCode): MSquareIndex {
  return { ci: extractColumnIndex(code), ri: extractRowIndex(code) };
}

export function indexToCode(index: MSquareIndex): MSquareCode {
  return `${String.fromCharCode(aCharCode + index.ci)}${index.ri + 1}`
}

// 'a0', 2, 1 -> 'c1'
export function codeWithMove(code: MSquareCode, columnMove: number, rowMove: number): MSquareCode {
  const index = codeToIndex(code);
  index.ci += columnMove;
  index.ri += rowMove;
  return indexToCode(index);
}

export function isValidCode(code: MSquareCode, columnCount: number, rowCount: number): boolean {
  if (code.length !== 2) {
    return false;
  }
  const index = codeToIndex(code);
  if (index.ci < 0 || index.ci > columnCount - 1) {
    return false;
  }
  if (index.ri < 0 || index.ri > rowCount - 1) {
    return false;
  }
  return true;
}
