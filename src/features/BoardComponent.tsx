import React from 'react';
import { Subject, Subscription, tap } from 'rxjs';
import { MBoardMove, MBoardMoves, MBoardValidMove } from '../models/board/board-moves';
import { MBSPiece, MBoardSquare } from '../models/board/board-square';
import './BoardComponent.scss';
import { SquareComponent } from './SquareComponent';
import { MGameState } from '../models/game/game-state';
import { MBoard } from '../models/board/board';

export interface BoardActionEvent {
  move: MBoardValidMove;
}

export interface BoardActionDoneEvent {
  move: MBoardMove;
  taken?: MBSPiece;
  autoPlay: boolean;
}

export interface BoardComponentProps {
  gameState: MGameState;
  gameBoard: MBoard;
  boardActionEvent: Subject<BoardActionEvent>;
  boardActionDoneEvent: Subject<BoardActionDoneEvent>;
}

export interface BoardComponentState {
  selectedSquare?: MBoardSquare;
}

export class BoardComponent extends React.Component<BoardComponentProps, BoardComponentState> {
  private subscription = new Subscription();

  public constructor(props: BoardComponentProps) {
    super(props);
    this.state = ({
      selectedSquare: undefined
    });
  }

  public componentDidMount(): void {
    this.subscription.add(
      this.props.boardActionDoneEvent.pipe(tap(e => this.onBoardActionDone(e))).subscribe()
    );
  }

  public componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  private onSquareClicked(square: MBoardSquare): void {
    if (this.state.selectedSquare === undefined && square.piece !== undefined && square.piece.side !== this.props.gameState.turn) {
      return;
    }

    if (this.state.selectedSquare === undefined) {
      // nothing selected -> selection of a piece
      if (square.piece !== undefined) {
        this.setState({ selectedSquare: square });
      }
      return;
    }

    const selectedSquare = this.state.selectedSquare;
    if (selectedSquare.piece === undefined) {
      // this should not happen
      return;
    }

    // same piece already selected -> unselect
    if (square.code === selectedSquare.code) {
      this.setState({ selectedSquare: undefined });
      return;
    }

    // if another piece of same color is clicked -> change selection
    if (square.piece !== undefined && square.piece.side === selectedSquare.piece.side) {
      this.setState({ selectedSquare: square });
      return;
    }

    // another piece already selected -> move
    const validMoves = MBoardMoves.validMoves(this.props.gameState, this.props.gameBoard, { from: selectedSquare.code });
    const validMove = validMoves.find(m => m.to === square.code);
    if (validMove !== undefined) {
      this.props.boardActionEvent.next({
        move: validMove
      });
    }
  }

  private onBoardActionDone(e: BoardActionDoneEvent): void {
    this.setState({ selectedSquare: undefined });
  }

  public render(): React.ReactNode {
    let validMoves: MBoardValidMove[] = [];
    if (this.state.selectedSquare !== undefined) {
      validMoves = MBoardMoves.validMoves(this.props.gameState, this.props.gameBoard, { from: this.state.selectedSquare.code });
    }

    const squares = [];
    for (let r = 0; r < this.props.gameBoard.rowCount; r++) {
      const rowSquares = [];
      for (let c = 0; c < this.props.gameBoard.columnCount; c++) {
        const square = this.props.gameBoard.squares[c][r];
        const lastMove = this.props.gameState.getLastMove();
        rowSquares.push(
          <SquareComponent
            model={square}
            selected={this.state.selectedSquare?.code === square.code}
            highlighted={validMoves.map(m => m.to).includes(square.code)}
            highlightedLastMove={square.code === lastMove?.from || square.code === lastMove?.to}
            onClicked={this.onSquareClicked.bind(this)}
          />
        )
      }
      squares.push(<tr className="square"><td className="border-left">{this.props.gameBoard.rowCount - r}</td>{rowSquares}</tr>);
    }
    return (
      <table className="board">
        <tbody>
          {squares}
          <tr>
            <td></td>
            <td className="border-bottom">a</td>
            <td className="border-bottom">b</td>
            <td className="border-bottom">c</td>
            <td className="border-bottom">d</td>
            <td className="border-bottom">e</td>
            <td className="border-bottom">f</td>
            <td className="border-bottom">g</td>
            <td className="border-bottom">h</td>
          </tr>
        </tbody>
      </table>
    );
  }
}
