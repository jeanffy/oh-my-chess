import * as boardRepresentation from './board-representation';

describe('MBoardRepresentation', (): void => {
  test('extractColumn', (): void => {
    expect(boardRepresentation.extractColumn('a1')).toEqual('a');
    expect(boardRepresentation.extractColumn('h8')).toEqual('h');
  });

  test('extractColumnIndex', (): void => {
    expect(boardRepresentation.extractColumnIndex('a1')).toEqual(0);
    expect(boardRepresentation.extractColumnIndex('h8')).toEqual(7);
  });

  test('extractRow', (): void => {
    expect(boardRepresentation.extractRow('a1')).toEqual(1);
    expect(boardRepresentation.extractRow('h8')).toEqual(8);
  });

  test('extractRowIndex', (): void => {
    expect(boardRepresentation.extractRowIndex('a1')).toEqual(0);
    expect(boardRepresentation.extractRowIndex('h8')).toEqual(7);
  });

  test('isValidCode', (): void => {
    expect(boardRepresentation.isValidCode('a1', 8, 8)).toBeTruthy();
    expect(boardRepresentation.isValidCode('h8', 8, 8)).toBeTruthy();
    expect(boardRepresentation.isValidCode('a0', 8, 8)).toBeFalsy();
    expect(boardRepresentation.isValidCode('a9', 8, 8)).toBeFalsy();
    expect(boardRepresentation.isValidCode('i1', 8, 8)).toBeFalsy();
  });

  test('codeToIndex', (): void => {
    expect(boardRepresentation.codeToIndex('a1')).toEqual({ ci: 0, ri: 0 });
    expect(boardRepresentation.codeToIndex('h8')).toEqual({ ci: 7, ri: 7 });
  });

  test('indexToCode', (): void => {
    expect(boardRepresentation.indexToCode({ ci: 0, ri: 0 })).toEqual('a1');
    expect(boardRepresentation.indexToCode({ ci: 7, ri: 7 })).toEqual('h8');
  });

  test('codeWithMove', (): void => {
    expect(boardRepresentation.codeWithMove('a1', 0, 0)).toEqual('a1');
    expect(boardRepresentation.codeWithMove('a1', 1, 1)).toEqual('b2');
    expect(boardRepresentation.codeWithMove('h8', -1, -1)).toEqual('g7');
  });
});
