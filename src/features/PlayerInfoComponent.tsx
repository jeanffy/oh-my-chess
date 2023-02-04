import React from 'react';
import './PlayerInfoComponent.scss';
import { Card, CardHeader, CardContent } from '@mui/material';

export interface PlayerInfoProps {
  title: string;
  materialScore: number;
  toMove: boolean;
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
    let titleClass = '';
    if (this.props.toMove) {
      titleClass = 'to-move';
    }
    return (
      <Card variant="outlined">
        <CardHeader title={this.props.title} className={titleClass}/>
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
