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

- forbid a move that would put the player (or AI) into a check or checkmate state
- detect checkmate state
- detect pat state
- handle end of game
- handle "en passant" move
- handle castling
- finish FEN notation handling (castling, en passant, half moves)
- implement [algebraic notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))
- implement undo move(s)
- highlight last move played
- handle pawn promotion
- implement a mecanism to allow user to enter FEN starting position

## Known bugs

With FEN `rnbqkb2/ppp1pppr/3p4/1B6/4P3/5PP1/PPPP4/RNBQK1N1 b (cs) (ep) (hm) 5`, the AI says "no move possible"
