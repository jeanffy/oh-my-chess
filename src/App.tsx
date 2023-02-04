import React from 'react';
import './App.scss';
import { MGameConfig } from './models/game/game-config';
import { BoardComponent, BoardActionEvent, BoardActionDoneEvent } from './features/BoardComponent';
import { MAIPlayerStrategy } from './models/ai-player/ai-player';
import { GameLogComponent } from './features/GameLogComponent';
import { Subject, tap } from 'rxjs';
import { MBSPieceSide } from './models/board/board-square';
import { GameControlsComponent } from './features/GameControlsComponent';
import { MAIPlayer } from './models/ai-player/ai-player';
import { MGame } from './models/game/game';
import { GameHudComponent } from './features/GameHudComponent';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface AppProps {
}

interface AppState {
  player1Autoplay: boolean;
  player2Autoplay: boolean;
  gameConfig: MGameConfig;
  gameOverDialogOpen: boolean;
}

class App extends React.Component<AppProps, AppState> {
  private game: MGame;
  private aiPlayer: MAIPlayer;

  private boardActionEvent = new Subject<BoardActionEvent>();
  private boardActionDoneEvent = new Subject<BoardActionDoneEvent>();

  public constructor(props: AppProps) {
    super(props);

    this.game = MGame.createWithFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    //this.game = MGame.createWithFEN('rnbqkbnr/1pppp3/p4pp1/7Q/8/4P2N/PPPP1PPP/RNB1KB1R w (cs) (ep) 0 1');
    //this.game = MGame.createWithFEN('8/p7/8/8/8/8/8/8 w KQkq - 0 1');
    //this.game = MGame.createWithFEN('8/8/8/8/pP6/8/8/8 b KQkq - 0 1');
    //this.game = MGame.createWithFEN('3Q2kr/p3p2p/4N3/6N1/8/3B1P2/R1P3PP/4K2R b KQkq - 0 22');
    //this.game = MGame.createWithFEN('1R6/7k/7p/8/6Q1/P7/8/8 w KQkq - 0 34');
    //this.game = MGame.createWithFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    //this.game = MGame.createWithFEN('r1bqk3/p2p1p2/2p3NQ/4p3/1p2P3/2P2P2/PP1P1P1P/RNB1KB1R w (cs) (ep) (hm) 12');
    //this.game = MGame.createWithFEN('8/8/8/8/8/8/2q5/K7 w KQkq - 0 1');
    //this.game = MGame.createWithFEN('2b3n1/Qppk2p1/2npp3/1B6/8/2NP2P1/PP3q2/R1K5 b (cs) (ep) (hm) 18');
    this.aiPlayer = new MAIPlayer(this.game);

    this.state = {
      player1Autoplay: false,
      player2Autoplay: false,
      gameConfig: this.game.config,
      gameOverDialogOpen: false
    };

    if ((this.game.state.turn === MBSPieceSide.Player1 && this.state.player1Autoplay) ||
        (this.game.state.turn === MBSPieceSide.Player2 && this.state.player2Autoplay)) {
      this.doAIPlayerMove();
    }
  }

  public componentDidMount(): void {
    this.boardActionEvent.pipe(tap(e => this.onBoardAction(e))).subscribe();
    this.boardActionDoneEvent.pipe(tap(e => this.onBoardActionDone(e))).subscribe();
  }

  public onBoardAction(e: BoardActionEvent): void {
    const taken = this.game.boardMove(e.move);

    let autoPlay = (this.game.state.turn === MBSPieceSide.Player1 ? this.state.player1Autoplay : this.state.player2Autoplay);
    if (this.game.state.player1Checkmate || this.game.state.player2Checkmate) {
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
      { gameConfig: this.game.config },
      (e.autoPlay ? this.doAIPlayerMove : undefined)
    );
  }

  private async doAIPlayerMove(): Promise<void> {
    // we use a timeout of 1 to allow UI to refresh
    setTimeout(async () => {
      const aiPlayerMove = await this.aiPlayer.getNextMove(this.game.state.turn, this.game.config.strategy);
      if (aiPlayerMove === undefined) {
        this.setState({ gameOverDialogOpen: true });
      } else {
        this.boardActionEvent.next({
          move: aiPlayerMove
        });
      }
    });
  }

  private onStrategyChanged(strategy: MAIPlayerStrategy): void {
    const newGameConfig = this.state.gameConfig;
    newGameConfig.strategy = strategy;
    this.setState({ gameConfig: newGameConfig });
  }

  public render() {
    return (
      <div className="App">
        <Dialog open={this.state.gameOverDialogOpen}>
          <DialogTitle></DialogTitle>
          <DialogContent>
            <DialogContentText>Game over</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={_ => this.setState({ gameOverDialogOpen: false })} autoFocus>OK</Button>
          </DialogActions>
        </Dialog>

        <div className="game-controls">
          <GameControlsComponent
            player1Autoplay={this.state.player1Autoplay}
            player2Autoplay={this.state.player2Autoplay}
            onPlayer1AutoChanged={checked => this.setState({ player1Autoplay: checked })}
            onPlayer2AutoChanged={checked => this.setState({ player2Autoplay: checked })}
            onPlayAIMoveClicked={this.doAIPlayerMove.bind(this)}
          />
        </div>
        <div className="game-area">
          <div className="board">
            <BoardComponent
              gameState={this.game.state}
              gameBoard={this.game.board}
              boardActionEvent={this.boardActionEvent}
              boardActionDoneEvent={this.boardActionDoneEvent}
            />
          </div>
          <GameHudComponent
            gameConfig={this.game.config}
            gameState={this.game.state}
            onStrategyChanged={strategy => this.onStrategyChanged.bind(this)(strategy)}
          />
        </div>
        <div className="game-bottom">
          <GameLogComponent
            gameState={this.game.state}
            notations={this.game.notations}
          />
        </div>
      </div>
    );
  }
}

export default App;
