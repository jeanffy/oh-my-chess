import React from 'react';
import './App.scss';
import { GameInfoModel } from './models/game-info.model';
import { BoardComponent, BoardActionEvent, BoardActionDoneEvent } from './features/BoardComponent';
import { BoardAIPlayerModel, BoardAIPlayerStrategy } from './models/board-ai-player.model';
import { BoardModel } from './models/board.model';
import { PieceColor } from './models/square.model';
import { GameInfoComponent } from './features/GameInfoComponent';
import { Subject, tap } from 'rxjs';

interface AppProps {
}

interface AppState {
  gameInfo: GameInfoModel;
}

class App extends React.Component<AppProps, AppState> {
  private board = new BoardModel();
  private aiPlayer = new BoardAIPlayerModel(this.board);

  private boardActionEvent = new Subject<BoardActionEvent>();
  private boardActionDoneEvent = new Subject<BoardActionDoneEvent>();

  public constructor(props: AppProps) {
    super(props);
    this.state = {
      gameInfo: {
        strategy: BoardAIPlayerStrategy.Greedy,
        turn: PieceColor.White,
        materialScores: this.board.getMaterialScores(),
        gameState: this.board.gameState
      }
    };
  }

  public componentDidMount(): void {
    this.boardActionEvent.pipe(tap(e => this.onBoardAction(e))).subscribe();
    this.boardActionDoneEvent.pipe(tap(e => this.onBoardActionDone(e))).subscribe();
  }

  public onBoardAction(e: BoardActionEvent): void {
    const taken = this.board.move(e.move);
    this.boardActionDoneEvent.next({
      move: e.move,
      autoPlay: e.autoPlay,
      taken: taken
    });
  }

  public onBoardActionDone(e: BoardActionDoneEvent): void {
    const newGameInfo: GameInfoModel = {
      ...this.state.gameInfo,
      turn: (this.state.gameInfo.turn === PieceColor.White ? PieceColor.Black : PieceColor.White),
      materialScores: this.board.getMaterialScores(),
      gameState: this.board.gameState
    };
    this.setState(
      { gameInfo: newGameInfo },
      (e.autoPlay ? this.doAIPlayerMove : undefined)
    );
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
        <BoardComponent
          model={this.board}
          gameInfo={this.state.gameInfo}
          boardActionEvent={this.boardActionEvent}
          boardActionDoneEvent={this.boardActionDoneEvent}
        />
        <GameInfoComponent gameInfo={this.state.gameInfo}/>
      </div>
    );
  }
}

export default App;
