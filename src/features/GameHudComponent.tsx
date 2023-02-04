import React from 'react';
import './GameHudComponent.scss';
import { MAIPlayerStrategy } from '../models/ai-player/ai-player';
import { MGameState } from '../models/game/game-state';
import { MGameConfig } from '../models/game/game-config';
import { PlayerInfoComponent } from './PlayerInfoComponent';
import { GameInfoComponent } from './GameInfoComponent';
import { MBSPieceSide } from '../models/board/board-square';

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
              title="Player 2"
              materialScore={this.props.gameState.materialScores.player2}
              toMove={this.props.gameState.turn === MBSPieceSide.Player2}
              check={this.props.gameState.player2Check}
              checkmate={this.props.gameState.player2Checkmate}
            />
          </div>
          <div className="player">
            <PlayerInfoComponent
              title="Player 1"
              materialScore={this.props.gameState.materialScores.player1}
              toMove={this.props.gameState.turn === MBSPieceSide.Player1}
              check={this.props.gameState.player1Check}
              checkmate={this.props.gameState.player1Checkmate}
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
