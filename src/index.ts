import 'index.css';

import { game } from './game';

import { board, clearBtnClick$ } from './ui';

board.onClick$.subscribe(game.makeMove.bind(game));

clearBtnClick$.subscribe(game.restart.bind(game));
