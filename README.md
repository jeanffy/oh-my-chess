# Chandid Chess

## Description

This is a (very) simple Chess game. This mainly aims at learning React.js and coding a Chess AI opponent.

Performance is not (maybe yet) at stake here.

## Status

The game is not in a playable status right now.

## Technical info

- project created with : `npx create-react-app candid-chess --template typescript`
- SASS added using instruvtions in https://create-react-app.dev/docs/adding-a-sass-stylesheet
- pieces icons from https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

## To do list

Not sorted:

- detect [stalemate](https://en.wikipedia.org/wiki/Stalemate) state
- detect [draw](https://en.wikipedia.org/wiki/Draw_(chess)) state
- handle end of game
- handle "[en passant](https://en.wikipedia.org/wiki/En_passant)" move
- handle [castling](https://en.wikipedia.org/wiki/Castling)
- finish FEN notation handling (castling, en passant, half moves)
- implement [algebraic notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))
- implement undo move(s)
- highlight last move played
- handle pawn [promotion](https://en.wikipedia.org/wiki/Promotion_(chess))
- implement a mecanism to allow user to enter FEN starting position
- detect [pure mate](https://en.wikipedia.org/wiki/Pure_mate) state

## Known bugs

Sometimes the console log can say `no move possible` whereas there is cleary some valid moves possible -> TODO: analyze console logs in that situation
