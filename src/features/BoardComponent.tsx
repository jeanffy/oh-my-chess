import React from 'react';
import { Subject, Subscription, tap } from 'rxjs';
import { BoardMove, BoardMovesModel, BoardValidMove } from '../models/board/board-moves.model';
import {  BoardModel } from '../models/board/board.model';
import { GameInfoModel } from '../models/game-info.model';
import { Piece, SquareModel } from '../models/square.model';
import './BoardComponent.scss';
import { SquareComponent } from './SquareComponent';

export interface BoardActionEvent {
  move: BoardMove;
}

export interface BoardActionDoneEvent {
  move: BoardMove;
  taken?: Piece;
  autoPlay: boolean;
}

export interface BoardComponentProps {
  model: BoardModel;
  gameInfo: GameInfoModel;
  boardActionEvent: Subject<BoardActionEvent>;
  boardActionDoneEvent: Subject<BoardActionDoneEvent>;
}

export interface BoardComponentState {
  selectedSquare?: SquareModel;
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

  private onSquareClicked(square: SquareModel): void {
    if (this.state.selectedSquare === undefined && square.piece !== undefined && square.piece.side !== this.props.gameInfo.turn) {
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
    const validMoves = BoardMovesModel.validMoves(this.props.model, { from: selectedSquare.code });
    if (validMoves.map(m => m.to).includes(square.code)) {
      this.props.boardActionEvent.next({
        move: { fromPiece: selectedSquare.piece, from: selectedSquare.code, to: square.code }
      });
    }
  }

  private onBoardActionDone(e: BoardActionDoneEvent): void {
    this.setState({ selectedSquare: undefined });
  }

  public render(): React.ReactNode {
    let validMoves: BoardValidMove[] = [];
    if (this.state.selectedSquare !== undefined) {
      validMoves = BoardMovesModel.validMoves(this.props.model, { from: this.state.selectedSquare.code });
    }

    const squares = [];
    for (let r = 0; r < this.props.model.rowCount; r++) {
      const rowSquares = [];
      for (let c = 0; c < this.props.model.columnCount; c++) {
        const square = this.props.model.squares[c][r];
        rowSquares.push(
          <SquareComponent
            model={square}
            selected={this.state.selectedSquare?.code === square.code}
            highlighted={validMoves.map(m => m.to).includes(square.code)}
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
