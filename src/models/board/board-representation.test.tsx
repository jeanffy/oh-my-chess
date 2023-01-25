import * as boardRepresentation from './board-representation';

boardRepresentation.init(8, 8);

describe('MBoardRepresentation', (): void => {
  test('isValidIndex', (): void => {
    expect(boardRepresentation.isValidIndex(new boardRepresentation.MSquareIndex(0, 0))).toBeTruthy();
    expect(boardRepresentation.isValidIndex(new boardRepresentation.MSquareIndex(7, 7))).toBeTruthy();
    expect(boardRepresentation.isValidIndex(new boardRepresentation.MSquareIndex(-1, -1))).toBeFalsy();
    expect(boardRepresentation.isValidIndex(new boardRepresentation.MSquareIndex(8, 8))).toBeFalsy();
  });

  test('isValidCode', (): void => {
    expect(boardRepresentation.isValidCode('a1')).toBeTruthy();
    expect(boardRepresentation.isValidCode('h8')).toBeTruthy();
    expect(boardRepresentation.isValidCode('a0')).toBeFalsy();
    expect(boardRepresentation.isValidCode('a9')).toBeFalsy();
    expect(boardRepresentation.isValidCode('i1')).toBeFalsy();
  });

  test('codeToIndex', (): void => {
    expect(boardRepresentation.codeToIndex('a1')).toEqual(new boardRepresentation.MSquareIndex(0, 7));
    expect(boardRepresentation.codeToIndex('h8')).toEqual(new boardRepresentation.MSquareIndex(7, 0));
  });

  test('indexToCode', (): void => {
    expect(boardRepresentation.indexToCode(0, 0)).toEqual('a8');
    expect(boardRepresentation.indexToCode(7, 7)).toEqual('h1');
  });

  test('indexToCodeEx', (): void => {
    expect(boardRepresentation.indexToCodeEx(new boardRepresentation.MSquareIndex(0, 0))).toEqual('a8');
    expect(boardRepresentation.indexToCodeEx(new boardRepresentation.MSquareIndex(7, 7))).toEqual('h1');
  });

  test('codeWithMove', (): void => {
    expect(boardRepresentation.codeWithMove('a1', 0, 0)).toEqual('a1');
    expect(boardRepresentation.codeWithMove('a1', 1, 1)).toEqual('b2');
    expect(boardRepresentation.codeWithMove('h8', -1, -1)).toEqual('g7');
  });

  test('codeWithMoveEx', (): void => {
    expect(boardRepresentation.codeWithMoveEx('a1', new boardRepresentation.MCodeMove(0, 0))).toEqual('a1');
    expect(boardRepresentation.codeWithMoveEx('a1', new boardRepresentation.MCodeMove(1, 1))).toEqual('b2');
    expect(boardRepresentation.codeWithMoveEx('h8', new boardRepresentation.MCodeMove(-1, -1))).toEqual('g7');
  });
});
