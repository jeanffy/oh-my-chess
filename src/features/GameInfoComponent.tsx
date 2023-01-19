import React from 'react';
import { MPieceSide } from '../models/board/square.model';
import { MGameInfo } from '../models/game/game-info.model';
import './GameInfoComponent.scss';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { MAIPlayerStrategy } from '../models/ai-player/ai-player.model';
import { MGameNotations } from '../models/game/game-notations.model';

export interface GameInfoProps {
  info: MGameInfo;
  notations: MGameNotations;
  onStrategyChanged: (strategy: MAIPlayerStrategy) => void;
}

export class GameInfoComponent extends React.Component<GameInfoProps> {
  public render(): React.ReactNode {
    const strategy = (this.props.info.strategy === MAIPlayerStrategy.Random ? 'random' : 'greedy');
    const turn = (this.props.info.turn === MPieceSide.Player1 ? 'Player 1' : 'Player 2');
    return (
      <div className="game-info">
        <div className="state">
          <FormControl>
            <InputLabel id="ai-strategy-label">AI strategy</InputLabel>
            <Select variant="outlined" id="ai-strategy-label" label="AI strategy" value={this.props.info.strategy}
              onChange={(e) => this.props.onStrategyChanged(e.target.value as MAIPlayerStrategy)}>
              <MenuItem value={MAIPlayerStrategy.Random}>Random</MenuItem>
              <MenuItem value={MAIPlayerStrategy.Greedy}>Greedy</MenuItem>
            </Select>
          </FormControl>
          {/* <TextField variant="outlined" label="AI strategy" value={strategy} inputProps={{ readOnly: true }}/> */}
          <TextField variant="outlined" label="Turn" value={turn} inputProps={{ readOnly: true }}/>
        </div>
        <TextField variant="outlined" label="FEN" value={this.props.notations.fen} inputProps={{ readOnly: true }}/>
      </div>
    );
  }
}
