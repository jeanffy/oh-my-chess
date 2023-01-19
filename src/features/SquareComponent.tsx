import React from 'react';
import { MPieceSide, MPieceKind, MSquare } from '../models/board/square.model';
import player1Rook from '../assets/images/pieces/green/rook.svg';
import player1Knight from '../assets/images/pieces/green/knight.svg';
import player1Bishop from '../assets/images/pieces/green/bishop.svg';
import player1Queen from '../assets/images/pieces/green/queen.svg';
import player1King from '../assets/images/pieces/green/king.svg';
import player1Pawn from '../assets/images/pieces/green/pawn.svg';
import player2Rook from '../assets/images/pieces/blue/rook.svg';
import player2Knight from '../assets/images/pieces/blue/knight.svg';
import player2Bishop from '../assets/images/pieces/blue/bishop.svg';
import player2Queen from '../assets/images/pieces/blue/queen.svg';
import player2King from '../assets/images/pieces/blue/king.svg';
import player2Pawn from '../assets/images/pieces/blue/pawn.svg';
import './SquareComponent.scss';

export interface SquareComponentProps {
  model: MSquare;
  selected: boolean;
  highlighted: boolean;
  highlightedLastMove: boolean;
  onClicked: (square: MSquare) => void;
}

export class SquareComponent extends React.Component<SquareComponentProps> {
  public constructor(props: SquareComponentProps) {
    super(props);
  }

  public render(): React.ReactNode {
    const selectedClass = (this.props.selected ? 'selected' : '');
    const highlightedClass = (this.props.highlighted ? 'highlighted' : '');
    const highlightedLastMoveClass = (this.props.highlightedLastMove ? 'highlighted-last-move' : '');
    const className = `${selectedClass} ${highlightedClass} ${highlightedLastMoveClass}`;

    const piece = this.props.model.piece;
    if (piece === undefined) {
      return <td className={className} onClick={() => this.props.onClicked(this.props.model)}></td>;
    }

    let imgSource;
    if (piece.side === MPieceSide.Player2) {
      switch (piece.kind) {
        case MPieceKind.Bishop: imgSource = player2Bishop; break;
        case MPieceKind.King: imgSource = player2King; break;
        case MPieceKind.Knight: imgSource = player2Knight; break;
        case MPieceKind.Pawn: imgSource = player2Pawn; break;
        case MPieceKind.Queen: imgSource = player2Queen; break;
        case MPieceKind.Rook: imgSource = player2Rook; break;
      }
    } else if (piece.side === MPieceSide.Player1) {
      switch (piece.kind) {
        case MPieceKind.Bishop: imgSource = player1Bishop; break;
        case MPieceKind.King: imgSource = player1King; break;
        case MPieceKind.Knight: imgSource = player1Knight; break;
        case MPieceKind.Pawn: imgSource = player1Pawn; break;
        case MPieceKind.Queen: imgSource = player1Queen; break;
        case MPieceKind.Rook: imgSource = player1Rook; break;
      }
    }
    if (imgSource === undefined) {
      return <td className={className} onClick={() => this.props.onClicked(this.props.model)}></td>;
    }

    return (
      <td
        className={className}
        onClick={() => this.props.onClicked(this.props.model)}>
        <img src={imgSource} alt=""/>
      </td>
    );
  }
}
