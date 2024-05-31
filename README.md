# Oh My Chess

Demo here: https://jeanffy.github.io/oh-my-chess

## Description

This is a (very) simple Chess game. This mainly aims at learning React.js and coding a Chess AI opponent.

Performance is not (maybe yet) at stake here.

## Status

The game is in a almost-playable state right now, the following is not handled:

- castling
- pawn promotion

## Technical info

- project created with : `npx create-react-app oh-my-chess --template typescript`
- SASS added using instructions in https://create-react-app.dev/docs/adding-a-sass-stylesheet
- pieces icons from https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces

## To do list

Not sorted:

- correctly implement end game
- implement "deep thinker" strategy (for now it is bound to "random" strategy)
- detect [stalemate](https://en.wikipedia.org/wiki/Stalemate) state
- detect [draw](https://en.wikipedia.org/wiki/Draw_(chess)) state
- handle [castling](https://en.wikipedia.org/wiki/Castling)
- finish FEN notation handling (castling)
- fully implement [algebraic notation](https://en.wikipedia.org/wiki/Algebraic_notation_(chess))
- implement undo move(s)
- handle pawn [promotion](https://en.wikipedia.org/wiki/Promotion_(chess))
- implement a mecanism to allow user to enter FEN starting position
- detect [pure mate](https://en.wikipedia.org/wiki/Pure_mate) state
