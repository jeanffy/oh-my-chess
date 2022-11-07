import React from 'react';
import { PieceColor, PieceKind, SquareModel } from '../models/square.model';
import blackRook from '../icons/black/rook.svg';
import blackKnight from '../icons/black/knight.svg';
import blackBishop from '../icons/black/bishop.svg';
import blackQueen from '../icons/black/queen.svg';
import blackKing from '../icons/black/king.svg';
import blackPawn from '../icons/black/pawn.svg';
import whiteRook from '../icons/white/rook.svg';
import whiteKnight from '../icons/white/knight.svg';
import whiteBishop from '../icons/white/bishop.svg';
import whiteQueen from '../icons/white/queen.svg';
import whiteKing from '../icons/white/king.svg';
import whitePawn from '../icons/white/pawn.svg';
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
    if (piece.color === PieceColor.Black) {
      switch (piece.kind) {
        case PieceKind.Bishop: imgSource = blackBishop; break;
        case PieceKind.King: imgSource = blackKing; break;
        case PieceKind.Knight: imgSource = blackKnight; break;
        case PieceKind.Pawn: imgSource = blackPawn; break;
        case PieceKind.Queen: imgSource = blackQueen; break;
        case PieceKind.Rook: imgSource = blackRook; break;
      }
    } else if (piece.color === PieceColor.White) {
      switch (piece.kind) {
        case PieceKind.Bishop: imgSource = whiteBishop; break;
        case PieceKind.King: imgSource = whiteKing; break;
        case PieceKind.Knight: imgSource = whiteKnight; break;
        case PieceKind.Pawn: imgSource = whitePawn; break;
        case PieceKind.Queen: imgSource = whiteQueen; break;
        case PieceKind.Rook: imgSource = whiteRook; break;
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
