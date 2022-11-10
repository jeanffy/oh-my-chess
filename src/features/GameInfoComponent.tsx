import React from 'react';
import { BoardAIPlayerStrategy } from '../models/board-ai-player.model';
import { PieceSide } from '../models/square.model';
import { GameInfoModel } from '../models/game-info.model';
import './GameInfoComponent.scss';
import { TextField } from '@mui/material';

export interface GameInfoProps {
  gameInfo: GameInfoModel;
}

export class GameInfoComponent extends React.Component<GameInfoProps> {
  public render(): React.ReactNode {
    const strategy = (this.props.gameInfo.strategy === BoardAIPlayerStrategy.Random ? 'random' : 'greedy');
    const turn = (this.props.gameInfo.turn === PieceSide.P1 ? 'Player 1' : 'Player 2');
    return (
      <div className="game-info">
        <div className="state">
          <TextField variant="outlined" label="AI strategy" value={strategy} inputProps={{ readOnly: true }}/>
          <TextField variant="outlined" label="Turn" value={turn} inputProps={{ readOnly: true }}/>
        </div>
        <div className="material-score">
          <TextField variant="outlined" label="Player 1 material score" value={this.props.gameInfo.materialScores.p1} inputProps={{ readOnly: true }}/>
          <TextField variant="outlined" label="Player 2 material score" value={this.props.gameInfo.materialScores.p2} inputProps={{ readOnly: true }}/>
        </div>
        <div className="check-state">
          <TextField variant="outlined" label="Player 1 check" value={this.props.gameInfo.gameState.p1Check ? 'true' : '-'} inputProps={{ readOnly: true }}/>
          <TextField variant="outlined" label="Player 2 check" value={this.props.gameInfo.gameState.p2Check ? 'true' : '-'} inputProps={{ readOnly: true }}/>
        </div>
        <div className="checkmate-state">
          <TextField variant="outlined" label="Player 1 checkmate" value={this.props.gameInfo.gameState.p1Checkmate ? 'true' : '-'} inputProps={{ readOnly: true }}/>
          <TextField variant="outlined" label="Player 2 checkmate" value={this.props.gameInfo.gameState.p2Checkmate ? 'true' : '-'} inputProps={{ readOnly: true }}/>
        </div>
        <TextField variant="outlined" label="FEN" value={this.props.gameInfo.gameStateNotations.fen} inputProps={{ readOnly: true }}/>
      </div>
    );
  }
}
