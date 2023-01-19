import React from 'react';
import './App.scss';
import { MGameInfo } from './models/game/game-info.model';
import { BoardComponent, BoardActionEvent, BoardActionDoneEvent } from './features/BoardComponent';
import { MAIPlayerStrategy } from './models/ai-player/ai-player.model';
import { GameInfoComponent } from './features/GameInfoComponent';
import { Subject, tap } from 'rxjs';
import { MPieceSide } from './models/board/square.model';
import { GameControlsComponent } from './features/GameControlsComponent';
import { PlayerInfoComponent } from './features/PlayerInfoComponent';
import { MAIPlayer } from './models/ai-player/ai-player.model';
import { MGame } from './models/game/game.model';

interface AppProps {
}

interface AppState {
  player1Autoplay: boolean;
  player2Autoplay: boolean;
  gameInfo: MGameInfo;
}

class App extends React.Component<AppProps, AppState> {
  private game: MGame;
  private aiPlayer: MAIPlayer;

  private boardActionEvent = new Subject<BoardActionEvent>();
  private boardActionDoneEvent = new Subject<BoardActionDoneEvent>();

  public constructor(props: AppProps) {
    super(props);

    this.game = MGame.createWithFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    this.aiPlayer = new MAIPlayer(this.game);

    this.state = {
      player1Autoplay: false,
      player2Autoplay: true,
      gameInfo: this.game.info
    };

    //this.board.initWithFEN('1R6/7k/7p/8/6Q1/P7/8/8 w KQkq - 0 34');
    //this.board.initWithFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    //this.board.initWithFEN('r1bqk3/p2p1p2/2p3NQ/4p3/1p2P3/2P2P2/PP1P1P1P/RNB1KB1R w (cs) (ep) (hm) 12');
    //this.board.initWithFEN('8/8/8/8/8/8/2q5/K7 w KQkq - 0 1');
    //this.board.initWithFEN('2b3n1/Qppk2p1/2npp3/1B6/8/2NP2P1/PP3q2/R1K5 b (cs) (ep) (hm) 18');

    // this.state = {
    //   player1Autoplay: false,
    //   player2Autoplay: true,
    //   gameInfo: MGameInfo.createWithBoard(this.board)
      // gameInfo: new GameInfo({
      //   strategy: BoardAIPlayerStrategy.Random,
      //   turn: this.board.turn,
      //   materialScores: this.board.getMaterialScores(),
      //   state: this.board.state,
      //   notations: this.board.notations
      // }
    // };

    if (this.game.info.turn === MPieceSide.Player2) {
      this.doAIPlayerMove();
    }
  }

  public componentDidMount(): void {
    this.boardActionEvent.pipe(tap(e => this.onBoardAction(e))).subscribe();
    this.boardActionDoneEvent.pipe(tap(e => this.onBoardActionDone(e))).subscribe();
  }

  public onBoardAction(e: BoardActionEvent): void {
    const taken = this.game.boardMove(e.move);

    let autoPlay = (this.game.info.turn === MPieceSide.Player1 ? this.state.player1Autoplay : this.state.player2Autoplay);
    if (this.game.info.state.player1Checkmate || this.game.info.state.player2Checkmate) {
      autoPlay = false;
    }

    this.boardActionDoneEvent.next({
      move: e.move,
      autoPlay: autoPlay,
      taken: taken
    });
  }

  public onBoardActionDone(e: BoardActionDoneEvent): void {
    this.setState(
      { gameInfo: this.game.info },
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

  private onStrategyChanged(strategy: MAIPlayerStrategy): void {
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
            game={this.game}
            boardActionEvent={this.boardActionEvent}
            boardActionDoneEvent={this.boardActionDoneEvent}
          />
          <div className="player">
            <PlayerInfoComponent
              title="Player 1"
              materialScore={this.game.info.materialScores.player1}
              check={this.game.info.state.player1Check}
              checkmate={this.game.info.state.player1Checkmate}
            />
          </div>
          <div className="player">
            <PlayerInfoComponent
              title="Player 2"
              materialScore={this.game.info.materialScores.player2}
              check={this.game.info.state.player2Check}
              checkmate={this.game.info.state.player2Checkmate}
            />
          </div>
        </div>
        <div className="bottom">
          <GameInfoComponent
            info={this.game.info}
            notations={this.game.notations}
            onStrategyChanged={strategy => this.onStrategyChanged.bind(this)(strategy)}
          />
        </div>
      </div>
    );
  }
}

export default App;
