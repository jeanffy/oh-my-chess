import { MBoardRepresentation, MCodeMove, MSquareIndex } from './board-representation';

MBoardRepresentation.init(8, 8);

describe('MBoardRepresentation', (): void => {
  test('isValidIndex', (): void => {
    expect(MBoardRepresentation.isValidIndex(new MSquareIndex(0, 0))).toBeTruthy();
    expect(MBoardRepresentation.isValidIndex(new MSquareIndex(7, 7))).toBeTruthy();
    expect(MBoardRepresentation.isValidIndex(new MSquareIndex(-1, -1))).toBeFalsy();
    expect(MBoardRepresentation.isValidIndex(new MSquareIndex(8, 8))).toBeFalsy();
  });

  test('isValidCode', (): void => {
    expect(MBoardRepresentation.isValidCode('a1')).toBeTruthy();
    expect(MBoardRepresentation.isValidCode('h8')).toBeTruthy();
    expect(MBoardRepresentation.isValidCode('a0')).toBeFalsy();
    expect(MBoardRepresentation.isValidCode('a9')).toBeFalsy();
    expect(MBoardRepresentation.isValidCode('i1')).toBeFalsy();
  });

  test('codeToIndex', (): void => {
    expect(MBoardRepresentation.codeToIndex('a1')).toEqual(new MSquareIndex(0, 7));
    expect(MBoardRepresentation.codeToIndex('h8')).toEqual(new MSquareIndex(7, 0));
  });

  test('indexToCode', (): void => {
    expect(MBoardRepresentation.indexToCode(0, 0)).toEqual('a8');
    expect(MBoardRepresentation.indexToCode(7, 7)).toEqual('h1');
  });

  test('indexToCodeEx', (): void => {
    expect(MBoardRepresentation.indexToCodeEx(new MSquareIndex(0, 0))).toEqual('a8');
    expect(MBoardRepresentation.indexToCodeEx(new MSquareIndex(7, 7))).toEqual('h1');
  });

  test('codeWithMove', (): void => {
    expect(MBoardRepresentation.codeWithMove('a1', 0, 0)).toEqual('a1');
    expect(MBoardRepresentation.codeWithMove('a1', 1, 1)).toEqual('b2');
    expect(MBoardRepresentation.codeWithMove('h8', -1, -1)).toEqual('g7');
  });

  test('codeWithMoveEx', (): void => {
    expect(MBoardRepresentation.codeWithMoveEx('a1', new MCodeMove(0, 0))).toEqual('a1');
    expect(MBoardRepresentation.codeWithMoveEx('a1', new MCodeMove(1, 1))).toEqual('b2');
    expect(MBoardRepresentation.codeWithMoveEx('h8', new MCodeMove(-1, -1))).toEqual('g7');
  });
});
