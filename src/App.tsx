import React from 'react';
import './App.scss';
import { GameInfoModel } from './models/game-info.model';
import { BoardComponent, BoardActionEvent, BoardActionDoneEvent } from './features/BoardComponent';
import { BoardAIPlayerModel, BoardAIPlayerStrategy } from './models/board-ai-player.model';
import { BoardModel } from './models/board.model';
import { GameInfoComponent } from './features/GameInfoComponent';
import { Subject, tap } from 'rxjs';
import { PieceSide } from './models/square.model';
import { Button, Checkbox, FormControlLabel } from '@mui/material';

interface AppProps {
}

interface AppState {
  p1Autoplay: boolean;
  p2Autoplay: boolean;
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
    //this.board.initWithFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    this.board.initWithFEN('r1bqk3/p2p1p2/2p3NQ/4p3/1p2P3/2P2P2/PP1P1P1P/RNB1KB1R w (cs) (ep) (hm) 12');
    //this.board.initWithFEN('8/8/8/8/8/8/2q5/K7 w KQkq - 0 1');
    //this.board.initWithFEN('2b3n1/Qppk2p1/2npp3/1B6/8/2NP2P1/PP3q2/R1K5 b (cs) (ep) (hm) 18');
    this.aiPlayer = new BoardAIPlayerModel(this.board);

    this.state = {
      p1Autoplay: false,
      p2Autoplay: true,
      gameInfo: {
        strategy: BoardAIPlayerStrategy.Random,
        turn: this.board.turn,
        materialScores: this.board.getMaterialScores(),
        gameState: this.board.gameState,
        gameStateNotations: this.board.gameStateNotations
      }
    };

    if (this.state.gameInfo.turn === PieceSide.P2) {
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
      autoPlay: (this.state.gameInfo.turn === PieceSide.P1 ? this.state.p2Autoplay : this.state.p1Autoplay),
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

  private onP1AutoplayChanged(event: React.SyntheticEvent<Element, Event>): void {
    const checkboxInput = event.target as HTMLInputElement;
    this.setState({ p1Autoplay: checkboxInput.checked });
  }

  private onP2AutoplayChanged(event: React.SyntheticEvent<Element, Event>): void {
    const checkboxInput = event.target as HTMLInputElement;
    this.setState({ p2Autoplay: checkboxInput.checked });
  }

  private onPlayAIMoveClicked(): void {
    this.doAIPlayerMove();
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

  public render() {
    return (
      <div className="App">
        <div className="actions">
          <FormControlLabel
            control={<Checkbox checked={this.state.p1Autoplay}/>}
            label="Autoplay P1"
            onChange={(e) => this.onP1AutoplayChanged(e)}/>
          <FormControlLabel
            control={<Checkbox checked={this.state.p2Autoplay}/>}
            label="Autoplay P2"
            onChange={(e) => this.onP2AutoplayChanged(e)}/>
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
