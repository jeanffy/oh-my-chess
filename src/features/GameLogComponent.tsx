import React from 'react';
import './GameLogComponent.scss';
import { TextField } from '@mui/material';
import { MGameNotations } from '../models/game/game-notations';
import { MGameState } from '../models/game/game-state';

export interface GameLogComponentProps {
  gameState: MGameState;
  notations: MGameNotations;
}

export class GameLogComponent extends React.Component<GameLogComponentProps> {
  private textFieldMoves = React.createRef<HTMLTextAreaElement>();

  public componentDidMount(): void {
    this.scrollMovesToBottom();
  }

  public componentDidUpdate(): void  {
    this.scrollMovesToBottom();
  }

  private scrollMovesToBottom(): void {
    if (this.textFieldMoves.current !== null) {
      this.textFieldMoves.current.scrollTop = this.textFieldMoves.current.scrollHeight;
    }
  }

  public render(): React.ReactNode {
    const startLine = '- Start of game -\n';

    const moves: string[] = [];
    for (let i = 0; i < this.props.gameState.moves.length; i += 2) {
      const move1 = this.props.gameState.moves[i]?.getAlgebraicNotation();
      const move2 = ((i + 1) < this.props.gameState.moves.length ? this.props.gameState.moves[i + 1]?.getAlgebraicNotation() : '');
      moves.push(`${move1} ${move2}`);
    }
    const movesWithNumber = moves.map((m, i) => `${i + 1}. ${m}`).join('\n');

    return (
      <div className="game-log">
        <TextField
          variant="outlined"
          inputProps={{ readOnly: true }}
          multiline
          rows={4}
          label="Moves"
          value={`${startLine}${movesWithNumber}`}
          inputRef={this.textFieldMoves}
        />
        <TextField
          variant="outlined"
          inputProps={{ readOnly: true }}
          label="FEN"
          value={this.props.notations.fen}
        />
      </div>
    );
  }
}
