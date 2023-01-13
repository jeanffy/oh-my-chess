import React from 'react';
import './App.scss';
import { GameInfoModel } from './models/game-info.model';
import { BoardComponent, BoardActionEvent, BoardActionDoneEvent } from './features/BoardComponent';
import { BoardAIPlayerModel, BoardAIPlayerStrategy } from './models/board/board-ai-player.model';
import { BoardModel } from './models/board/board.model';
import { GameInfoComponent } from './features/GameInfoComponent';
import { Subject, tap } from 'rxjs';
import { PieceSide } from './models/square.model';
import { GameControlsComponent } from './features/GameControlsComponent';
import { PlayerInfoComponent } from './features/PlayerInfoComponent';

interface AppProps {
}

interface AppState {
  player1Autoplay: boolean;
  player2Autoplay: boolean;
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
    //this.board.initWithFEN('1R6/7k/7p/8/6Q1/P7/8/8 w KQkq - 0 34');
    this.board.initWithFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    //this.board.initWithFEN('r1bqk3/p2p1p2/2p3NQ/4p3/1p2P3/2P2P2/PP1P1P1P/RNB1KB1R w (cs) (ep) (hm) 12');
    //this.board.initWithFEN('8/8/8/8/8/8/2q5/K7 w KQkq - 0 1');
    //this.board.initWithFEN('2b3n1/Qppk2p1/2npp3/1B6/8/2NP2P1/PP3q2/R1K5 b (cs) (ep) (hm) 18');
    this.aiPlayer = new BoardAIPlayerModel(this.board);

    this.state = {
      player1Autoplay: false,
      player2Autoplay: true,
      gameInfo: {
        strategy: BoardAIPlayerStrategy.Random,
        turn: this.board.turn,
        materialScores: this.board.getMaterialScores(),
        gameState: this.board.gameState,
        gameStateNotations: this.board.gameStateNotations
      }
    };

    if (this.state.gameInfo.turn === PieceSide.Player2) {
      this.doAIPlayerMove();
    }
  }

  public componentDidMount(): void {
    this.boardActionEvent.pipe(tap(e => this.onBoardAction(e))).subscribe();
    this.boardActionDoneEvent.pipe(tap(e => this.onBoardActionDone(e))).subscribe();
  }

  public onBoardAction(e: BoardActionEvent): void {
    const taken = this.board.move(e.move);
    this.board.updateState();
    this.boardActionDoneEvent.next({
      move: e.move,
      autoPlay: (this.state.gameInfo.turn === PieceSide.Player1 ? this.state.player2Autoplay : this.state.player1Autoplay),
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

  private async doAIPlayerMove(): Promise<void> {
    // we use a timeout of 1 to allow UI to refresh
    setTimeout(async () => {
      const aiPlayerMove = await this.aiPlayer.getNextMove(this.state.gameInfo.turn, this.state.gameInfo.strategy);
      this.boardActionEvent.next({
        move: aiPlayerMove
      });
    });
  }

  private onStrategyChanged(strategy: BoardAIPlayerStrategy): void {
    const newGameInfo = this.state.gameInfo;
    newGameInfo.strategy = strategy;
    this.setState({ gameInfo: newGameInfo });
  }

  public render() {
    return (
      <div className="App">
        <div className="controls">
          <GameControlsComponent
            player1Autoplay={this.state.player1Autoplay}
            player2Autoplay={this.state.player2Autoplay}
            onPlayer1AutoChanged={checked => this.setState({ player1Autoplay: checked })}
            onPlayer2AutoChanged={checked => this.setState({ player2Autoplay: checked })}
            onPlayAIMoveClicked={this.doAIPlayerMove.bind(this)}
          />
        </div>
        <div className="board">
          <BoardComponent
            model={this.board}
            gameInfo={this.state.gameInfo}
            boardActionEvent={this.boardActionEvent}
            boardActionDoneEvent={this.boardActionDoneEvent}
          />
          <div className="player">
            <PlayerInfoComponent
              title="Player 1"
              materialScore={this.state.gameInfo.materialScores.player1}
              check={this.state.gameInfo.gameState.player1Check}
              checkmate={this.state.gameInfo.gameState.player1Checkmate}
            />
          </div>
          <div className="player">
            <PlayerInfoComponent
              title="Player 2"
              materialScore={this.state.gameInfo.materialScores.player2}
              check={this.state.gameInfo.gameState.player2Check}
              checkmate={this.state.gameInfo.gameState.player2Checkmate}
            />
          </div>
        </div>
        <div className="bottom">
          <GameInfoComponent gameInfo={this.state.gameInfo} onStrategyChanged={strategy => this.onStrategyChanged.bind(this)(strategy)}/>
        </div>
      </div>
    );
  }
}

export default App;
