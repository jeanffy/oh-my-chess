import React from 'react';
import { PieceSide, PieceKind, SquareModel } from '../models/square.model';
import p1Rook from '../icons/green/rook.svg';
import p1Knight from '../icons/green/knight.svg';
import p1Bishop from '../icons/green/bishop.svg';
import p1Queen from '../icons/green/queen.svg';
import p1King from '../icons/green/king.svg';
import p1Pawn from '../icons/green/pawn.svg';
import p2Rook from '../icons/blue/rook.svg';
import p2Knight from '../icons/blue/knight.svg';
import p2Bishop from '../icons/blue/bishop.svg';
import p2Queen from '../icons/blue/queen.svg';
import p2King from '../icons/blue/king.svg';
import p2Pawn from '../icons/blue/pawn.svg';
import './SquareComponent.scss';

export interface SquareComponentProps {
  model: SquareModel;
  selected: boolean;
  highlighted: boolean;
  onClicked: (square: SquareModel) => void;
}

export class SquareComponent extends React.Component<SquareComponentProps> {
  public constructor(props: SquareComponentProps) {
    super(props);
  }

  public render(): React.ReactNode {
    const selectedClass = (this.props.selected ? 'selected' : '');
    const highlightedClass = (this.props.highlighted ? 'highlighted' : '');
    const className = `${selectedClass} ${highlightedClass}`;

    const piece = this.props.model.piece;
    if (piece === undefined) {
      return <td className={className} onClick={() => this.props.onClicked(this.props.model)}></td>;
    }

    let imgSource;
    if (piece.side === PieceSide.P2) {
      switch (piece.kind) {
        case PieceKind.Bishop: imgSource = p2Bishop; break;
        case PieceKind.King: imgSource = p2King; break;
        case PieceKind.Knight: imgSource = p2Knight; break;
        case PieceKind.Pawn: imgSource = p2Pawn; break;
        case PieceKind.Queen: imgSource = p2Queen; break;
        case PieceKind.Rook: imgSource = p2Rook; break;
      }
    } else if (piece.side === PieceSide.P1) {
      switch (piece.kind) {
        case PieceKind.Bishop: imgSource = p1Bishop; break;
        case PieceKind.King: imgSource = p1King; break;
        case PieceKind.Knight: imgSource = p1Knight; break;
        case PieceKind.Pawn: imgSource = p1Pawn; break;
        case PieceKind.Queen: imgSource = p1Queen; break;
        case PieceKind.Rook: imgSource = p1Rook; break;
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
