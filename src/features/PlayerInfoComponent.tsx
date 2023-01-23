import React from 'react';
import './PlayerInfoComponent.scss';
import { Card, CardHeader, CardContent } from '@mui/material';

export interface PlayerInfoProps {
  title: string;
  materialScore: number;
  check: boolean;
  checkmate: boolean;
}

export class PlayerInfoComponent extends React.Component<PlayerInfoProps> {
  public render(): React.ReactNode {
    let checkValue = <td className="value">-</td>;
    if (this.props.check) {
      checkValue = <td className="value emphasis">true</td>;
    }
    let checkmateValue = <td className="value">-</td>;
    if (this.props.checkmate) {
      checkmateValue = <td className="value emphasis">true</td>;
    }
    return (
      <Card variant="outlined">
        <CardHeader title={this.props.title}/>
        <CardContent>
          <table className="player-info">
            <tr>
              <td>Material score</td>
              <td className="value">{this.props.materialScore}</td>
            </tr>
            <tr>
              <td>Check state</td>
              {checkValue}
            </tr>
            <tr>
              <td>Checkmate state</td>
              {checkmateValue}
            </tr>
          </table>
        </CardContent>
      </Card>
    );
  }
}
