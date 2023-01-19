import React from 'react';
import { Subject, Subscription, tap } from 'rxjs';
import { MBoardMove, MBoardMoves, MBoardValidMove } from '../models/board/board-moves.model';
import { MGame } from '../models/game/game.model';
import { MPiece, MSquare } from '../models/board/square.model';
import './BoardComponent.scss';
import { SquareComponent } from './SquareComponent';

export interface BoardActionEvent {
  move: MBoardMove;
}

export interface BoardActionDoneEvent {
  move: MBoardMove;
  taken?: MPiece;
  autoPlay: boolean;
}

export interface BoardComponentProps {
  game: MGame;
  boardActionEvent: Subject<BoardActionEvent>;
  boardActionDoneEvent: Subject<BoardActionDoneEvent>;
}

export interface BoardComponentState {
  selectedSquare?: MSquare;
  lastMove?: MBoardMove;
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

  private onSquareClicked(square: MSquare): void {
    if (this.state.selectedSquare === undefined && square.piece !== undefined && square.piece.side !== this.props.game.info.turn) {
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
    const validMoves = MBoardMoves.validMoves(this.props.game.info.state, this.props.game.board, { from: selectedSquare.code });
    if (validMoves.map(m => m.to).includes(square.code)) {
      const boardMove = { fromPiece: selectedSquare.piece, from: selectedSquare.code, to: square.code };
      this.props.boardActionEvent.next({
        move: boardMove
      });
      this.setState({ lastMove: boardMove });
    }
  }

  private onBoardActionDone(e: BoardActionDoneEvent): void {
    this.setState({ selectedSquare: undefined });
  }

  public render(): React.ReactNode {
    let validMoves: MBoardValidMove[] = [];
    if (this.state.selectedSquare !== undefined) {
      validMoves = MBoardMoves.validMoves(this.props.game.info.state, this.props.game.board, { from: this.state.selectedSquare.code });
    }

    const squares = [];
    for (let r = 0; r < this.props.game.board.rowCount; r++) {
      const rowSquares = [];
      for (let c = 0; c < this.props.game.board.columnCount; c++) {
        const square = this.props.game.board.squares[c][r];
        rowSquares.push(
          <SquareComponent
            model={square}
            selected={this.state.selectedSquare?.code === square.code}
            highlighted={validMoves.map(m => m.to).includes(square.code)}
            highlightedLastMove={square.code === this.state.lastMove?.from || square.code === this.state.lastMove?.to}
            onClicked={this.onSquareClicked.bind(this)}
          />
        )
      }
      squares.push(<tr>{rowSquares}</tr>);
    }
    return (
      <table className="board">
        <tbody>
          {squares}
        </tbody>
      </table>
    );
  }
}
