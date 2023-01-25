import React from 'react';
import { MBSPieceSide } from '../models/board/board-square';
import './GameInfoComponent.scss';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { MAIPlayerStrategy } from '../models/ai-player/ai-player';
import { MGameState } from '../models/game/game-state';
import { MGameConfig } from '../models/game/game-config';

export interface GameInfoComponentProps {
  gameState: MGameState;
  gameConfig: MGameConfig;
  onStrategyChanged: (strategy: MAIPlayerStrategy) => void;
}

export class GameInfoComponent extends React.Component<GameInfoComponentProps> {
  public render(): React.ReactNode {
    const turn = (this.props.gameState.turn === MBSPieceSide.Player1 ? 'Player 1' : 'Player 2');
    return (
      <div className="state">
        <FormControl>
          <InputLabel id="ai-strategy-label">AI strategy</InputLabel>
          <Select variant="outlined" id="ai-strategy-label" label="AI strategy" value={this.props.gameConfig.strategy}
            onChange={(e) => this.props.onStrategyChanged(e.target.value as MAIPlayerStrategy)}>
            <MenuItem value={MAIPlayerStrategy.Random}>Random</MenuItem>
            <MenuItem value={MAIPlayerStrategy.Greedy}>Greedy</MenuItem>
            <MenuItem value={MAIPlayerStrategy.DeepThinker}>Deep thinker</MenuItem>
          </Select>
        </FormControl>
        <TextField variant="outlined" label="Turn" value={turn} inputProps={{ readOnly: true }}/>
      </div>
    );
  }
}
