import React from 'react';
import './App.scss';
import { GameInfoModel } from './models/game-info.model';
import { BoardComponent, BoardActionEvent, BoardActionDoneEvent } from './features/BoardComponent';
import { BoardAIPlayerModel, BoardAIPlayerStrategy } from './models/board-ai-player.model';
import { BoardModel } from './models/board.model';
import { GameInfoComponent } from './features/GameInfoComponent';
import { Subject, tap } from 'rxjs';
import { PieceColor } from './models/square.model';
import { Button } from '@mui/material';

interface AppProps {
}

interface AppState {
  gameInfo: GameInfoModel;
}

class App extends React.Component<AppProps, AppState> {
  private board: BoardModel;
  private aiPlayer: BoardAIPlayerModel;

  private boardActionEvent = new Subject<BoardActionEvent>();
  private boardActionDoneEvent = new Subject<BoardActionDoneEvent>();

  public constructor(props: AppProps) {
    super(props);

    this.board = new BoardModel();
    this.board.initWithFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    this.aiPlayer = new BoardAIPlayerModel(this.board);

    this.state = {
      gameInfo: {
        strategy: BoardAIPlayerStrategy.Greedy,
        turn: this.board.turn,
        materialScores: this.board.getMaterialScores(),
        gameState: this.board.gameState,
        gameStateNotations: this.board.gameStateNotations
      }
    };

    if (this.state.gameInfo.turn === PieceColor.Black) {
      this.doAIPlayerMove();
    }
  }

  public componentDidMount(): void {
    this.boardActionEvent.pipe(tap(e => this.onBoardAction(e))).subscribe();
    this.boardActionDoneEvent.pipe(tap(e => this.onBoardActionDone(e))).subscribe();
  }

  public onBoardAction(e: BoardActionEvent): void {
    const taken = this.board.move(e.move);
    this.boardActionDoneEvent.next({
      move: e.move,
      autoPlay: false, //e.autoPlay,
      taken: taken
    });
  }

  public onBoardActionDone(e: BoardActionDoneEvent): void {
    const newGameInfo: GameInfoModel = {
      ...this.state.gameInfo,
      turn: this.board.turn,
      materialScores: this.board.getMaterialScores(),
      gameState: this.board.gameState,
      gameStateNotations: this.board.gameStateNotations
    };
    this.setState(
      { gameInfo: newGameInfo },
      (e.autoPlay ? this.doAIPlayerMove : undefined)
    );
  }

  private onPlayAIMoveClicked(): void {
    this.doAIPlayerMove();
  }

  private async doAIPlayerMove(): Promise<void> {
    const aiPlayerMove = await this.aiPlayer.getNextMove(this.state.gameInfo.turn, this.state.gameInfo.strategy);
    this.boardActionEvent.next({
      move: aiPlayerMove,
      autoPlay: false
    });
  }

  public render() {
    return (
      <div className="App">
        <div className="actions">
          <Button variant="outlined" onClick={() => this.onPlayAIMoveClicked()}>Play AI move</Button>
        </div>
        <div className="board">
          <BoardComponent
            model={this.board}
            gameInfo={this.state.gameInfo}
            boardActionEvent={this.boardActionEvent}
            boardActionDoneEvent={this.boardActionDoneEvent}
          />
          <GameInfoComponent gameInfo={this.state.gameInfo}/>
        </div>
      </div>
    );
  }
}

export default App;
