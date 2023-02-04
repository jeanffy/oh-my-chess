import React from 'react';
import './GameHudComponent.scss';
import { MAIPlayerStrategy } from '../models/ai-player/ai-player';
import { MGameState } from '../models/game/game-state';
import { MGameConfig } from '../models/game/game-config';
import { PlayerInfoComponent } from './PlayerInfoComponent';
import { GameInfoComponent } from './GameInfoComponent';

export interface GameHudComponentProps {
  gameState: MGameState;
  gameConfig: MGameConfig;
  onStrategyChanged: (strategy: MAIPlayerStrategy) => void;
}

export class GameHudComponent extends React.Component<GameHudComponentProps> {
  public render(): React.ReactNode {
    return (
      <div className="hud-component">
        <div className="players">
          <div className="player">
            <PlayerInfoComponent
              title="Player 1 (bottom)"
              materialScore={this.props.gameState.materialScores.player1}
              check={this.props.gameState.player1Check}
              checkmate={this.props.gameState.player1Checkmate}
            />
          </div>
          <div className="player">
            <PlayerInfoComponent
              title="Player 2 (top)"
              materialScore={this.props.gameState.materialScores.player2}
              check={this.props.gameState.player2Check}
              checkmate={this.props.gameState.player2Checkmate}
            />
          </div>
        </div>
        <div className="game-info">
          <GameInfoComponent
            gameConfig={this.props.gameConfig}
            gameState={this.props.gameState}
            onStrategyChanged={strategy => this.props.onStrategyChanged(strategy)}
          />
        </div>
      </div>
    );
  }
}
