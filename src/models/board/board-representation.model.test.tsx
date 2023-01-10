import { BoardRepresentationModel, CodeMove, SquareIndex } from './board-representation.model';

BoardRepresentationModel.init(8, 8);

describe('BoardRepresentationModel', (): void => {
  test('isValidIndex', (): void => {
    expect(BoardRepresentationModel.isValidIndex(new SquareIndex(0, 0))).toBeTruthy();
    expect(BoardRepresentationModel.isValidIndex(new SquareIndex(7, 7))).toBeTruthy();
    expect(BoardRepresentationModel.isValidIndex(new SquareIndex(-1, -1))).toBeFalsy();
    expect(BoardRepresentationModel.isValidIndex(new SquareIndex(8, 8))).toBeFalsy();
  });

  test('isValidCode', (): void => {
    expect(BoardRepresentationModel.isValidCode('a1')).toBeTruthy();
    expect(BoardRepresentationModel.isValidCode('h8')).toBeTruthy();
    expect(BoardRepresentationModel.isValidCode('a0')).toBeFalsy();
    expect(BoardRepresentationModel.isValidCode('a9')).toBeFalsy();
    expect(BoardRepresentationModel.isValidCode('i1')).toBeFalsy();
  });

  test('codeToIndex', (): void => {
    expect(BoardRepresentationModel.codeToIndex('a1')).toEqual(new SquareIndex(0, 7));
    expect(BoardRepresentationModel.codeToIndex('h8')).toEqual(new SquareIndex(7, 0));
  });

  test('indexToCode', (): void => {
    expect(BoardRepresentationModel.indexToCode(0, 0)).toEqual('a8');
    expect(BoardRepresentationModel.indexToCode(7, 7)).toEqual('h1');
  });

  test('indexToCodeEx', (): void => {
    expect(BoardRepresentationModel.indexToCodeEx(new SquareIndex(0, 0))).toEqual('a8');
    expect(BoardRepresentationModel.indexToCodeEx(new SquareIndex(7, 7))).toEqual('h1');
  });

  test('codeWithMove', (): void => {
    expect(BoardRepresentationModel.codeWithMove('a1', 0, 0)).toEqual('a1');
    expect(BoardRepresentationModel.codeWithMove('a1', 1, 1)).toEqual('b2');
    expect(BoardRepresentationModel.codeWithMove('h8', -1, -1)).toEqual('g7');
  });

  test('codeWithMoveEx', (): void => {
    expect(BoardRepresentationModel.codeWithMoveEx('a1', new CodeMove(0, 0))).toEqual('a1');
    expect(BoardRepresentationModel.codeWithMoveEx('a1', new CodeMove(1, 1))).toEqual('b2');
    expect(BoardRepresentationModel.codeWithMoveEx('h8', new CodeMove(-1, -1))).toEqual('g7');
  });
});
