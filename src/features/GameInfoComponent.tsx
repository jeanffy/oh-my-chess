import React from 'react';
import { BoardAIPlayerStrategy } from '../models/board-ai-player.model';
import { PieceColor } from '../models/square.model';
import { GameInfoModel } from '../models/game-info.model';
import './GameInfoComponent.scss';
import { TextField } from '@mui/material';

export interface GameInfoProps {
  gameInfo: GameInfoModel;
}

export class GameInfoComponent extends React.Component<GameInfoProps> {
  public render(): React.ReactNode {
    const strategy = (this.props.gameInfo.strategy === BoardAIPlayerStrategy.Random ? 'random' : 'greedy');
    const turn = (this.props.gameInfo.turn === PieceColor.White ? 'white' : 'black');
    return (
      <div className="game-info">
        <div className="state">
          <TextField variant="outlined" label="AI strategy" value={strategy} inputProps={{ readOnly: true }}/>
          <TextField variant="outlined" label="Turn" value={turn} inputProps={{ readOnly: true }}/>
        </div>
        <div className="material-score">
          <TextField variant="outlined" label="Material score white" value={this.props.gameInfo.materialScores.white} inputProps={{ readOnly: true }}/>
          <TextField variant="outlined" label="Material score black" value={this.props.gameInfo.materialScores.black} inputProps={{ readOnly: true }}/>
        </div>
        <div className="check-state">
          <TextField variant="outlined" label="Check state white" value={this.props.gameInfo.gameState.whiteCheck ? 'true' : '-'} inputProps={{ readOnly: true }}/>
          <TextField variant="outlined" label="Check state black" value={this.props.gameInfo.gameState.blackCheck ? 'true' : '-'} inputProps={{ readOnly: true }}/>
        </div>
        <div className="checkmate-state">
          <TextField variant="outlined" label="Mate state white" value={this.props.gameInfo.gameState.whiteCheckmate ? 'true' : '-'} inputProps={{ readOnly: true }}/>
          <TextField variant="outlined" label="Mate state black" value={this.props.gameInfo.gameState.blackCheckmate ? 'true' : '-'} inputProps={{ readOnly: true }}/>
        </div>
        <TextField variant="outlined" label="FEN" value={this.props.gameInfo.gameStateNotations.fen} inputProps={{ readOnly: true }}/>
      </div>
    );
  }
}
