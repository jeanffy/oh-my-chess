import React from 'react';
import { MBSPieceSide, MBSPieceKind, MBoardSquare } from '../models/board/board-square';
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
  model: MBoardSquare;
  selected: boolean;
  highlighted: boolean;
  highlightedLastMove: boolean;
  onClicked: (square: MBoardSquare) => void;
}

export class SquareComponent extends React.Component<SquareComponentProps> {
  public render(): React.ReactNode {
    const selectedClass = (this.props.selected ? 'selected' : '');
    const highlightedClass = (this.props.highlighted ? 'highlighted' : '');
    const highlightedLastMoveClass = (this.props.highlightedLastMove ? 'highlighted-last-move' : '');
    const className = `square ${selectedClass} ${highlightedClass} ${highlightedLastMoveClass}`;

    const piece = this.props.model.piece;
    if (piece === undefined) {
      return <td className={className} onClick={() => this.props.onClicked(this.props.model)}></td>;
    }

    let imgSource;
    if (piece.side === MBSPieceSide.Player2) {
      switch (piece.kind) {
        case MBSPieceKind.Bishop: imgSource = player2Bishop; break;
        case MBSPieceKind.King: imgSource = player2King; break;
        case MBSPieceKind.Knight: imgSource = player2Knight; break;
        case MBSPieceKind.Pawn: imgSource = player2Pawn; break;
        case MBSPieceKind.Queen: imgSource = player2Queen; break;
        case MBSPieceKind.Rook: imgSource = player2Rook; break;
      }
    } else if (piece.side === MBSPieceSide.Player1) {
      switch (piece.kind) {
        case MBSPieceKind.Bishop: imgSource = player1Bishop; break;
        case MBSPieceKind.King: imgSource = player1King; break;
        case MBSPieceKind.Knight: imgSource = player1Knight; break;
        case MBSPieceKind.Pawn: imgSource = player1Pawn; break;
        case MBSPieceKind.Queen: imgSource = player1Queen; break;
        case MBSPieceKind.Rook: imgSource = player1Rook; break;
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
