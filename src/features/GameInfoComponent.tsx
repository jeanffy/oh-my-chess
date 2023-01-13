import React from 'react';
import { BoardAIPlayerStrategy } from '../models/board/board-ai-player.model';
import { PieceSide } from '../models/square.model';
import { GameInfoModel } from '../models/game-info.model';
import './GameInfoComponent.scss';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

export interface GameInfoProps {
  gameInfo: GameInfoModel;
  onStrategyChanged: (strategy: BoardAIPlayerStrategy) => void;
}

export class GameInfoComponent extends React.Component<GameInfoProps> {
  public render(): React.ReactNode {
    const strategy = (this.props.gameInfo.strategy === BoardAIPlayerStrategy.Random ? 'random' : 'greedy');
    const turn = (this.props.gameInfo.turn === PieceSide.Player1 ? 'Player 1' : 'Player 2');
    return (
      <div className="game-info">
        <div className="state">
          <FormControl>
            <InputLabel id="ai-strategy-label">AI strategy</InputLabel>
            <Select variant="outlined" id="ai-strategy-label" label="AI strategy" value={this.props.gameInfo.strategy}
              onChange={(e) => this.props.onStrategyChanged(e.target.value as BoardAIPlayerStrategy)}>
              <MenuItem value={BoardAIPlayerStrategy.Random}>Random</MenuItem>
              <MenuItem value={BoardAIPlayerStrategy.Greedy}>Greedy</MenuItem>
            </Select>
          </FormControl>
          {/* <TextField variant="outlined" label="AI strategy" value={strategy} inputProps={{ readOnly: true }}/> */}
          <TextField variant="outlined" label="Turn" value={turn} inputProps={{ readOnly: true }}/>
        </div>
        <TextField variant="outlined" label="FEN" value={this.props.gameInfo.gameStateNotations.fen} inputProps={{ readOnly: true }}/>
      </div>
    );
  }
}
