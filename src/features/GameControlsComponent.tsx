import React from 'react';
import './GameControlsComponent.scss';
import { Button, Checkbox, FormControlLabel } from '@mui/material';

export interface GameControlsProps {
  player1Autoplay: boolean;
  player2Autoplay: boolean;
  onPlayer1AutoChanged: (checked: boolean) => void;
  onPlayer2AutoChanged: (checked: boolean) => void;
  onPlayAIMoveClicked: () => void;
}

export class GameControlsComponent extends React.Component<GameControlsProps> {
  public render(): React.ReactNode {
    return (
      <>
        <FormControlLabel
          control={<Checkbox checked={this.props.player1Autoplay}/>}
          label="Autoplay Player 1"
          onChange={(e) => this.props.onPlayer1AutoChanged((e.target as HTMLInputElement).checked)}/>
        <FormControlLabel
          control={<Checkbox checked={this.props.player2Autoplay}/>}
          label="Autoplay Player 2"
          onChange={(e) => this.props.onPlayer2AutoChanged((e.target as HTMLInputElement).checked)}/>
        <Button variant="outlined" onClick={() => this.props.onPlayAIMoveClicked()}>Play AI move</Button>
      </>
    );
  }
}
