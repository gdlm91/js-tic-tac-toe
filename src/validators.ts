import { ISpotInfo, getSpot, Status, Values } from './game';

function validator(board: ISpotInfo[][], validator: ISpotInfo[][]) {
   let valid = false;

   for (var i = 0; i < validator.length; i++) {
      var val = validator[i];
      if (getSpot(board, val[0]).value !== Values.empty &&
         getSpot(board, val[0]).value === getSpot(board, val[1]).value &&
         getSpot(board, val[1]).value === getSpot(board, val[2]).value) {

         return true;
      }
   }

   return false;
}

function isFull(board) {
   for (var r = 0; r < board.length; r++) {
      let row = board[r];
      for (var s = 0; s < row.length; s++) {
         let spot = row[s];
         if (spot.value === Values.empty) {
            return false;
         }
      }
   }

   return true;
}

const hValidator = [
   [
      { row: 0, spot: 0 }, { row: 0, spot: 1 }, { row: 0, spot: 2 }
   ],
   [
      { row: 1, spot: 0 }, { row: 1, spot: 1 }, { row: 1, spot: 2 }
   ],
   [
      { row: 2, spot: 0 }, { row: 2, spot: 1 }, { row: 2, spot: 2 }
   ]
];

const vValidator = [
   [
      { row: 0, spot: 0 }, { row: 1, spot: 0 }, { row: 2, spot: 0 }
   ],
   [
      { row: 0, spot: 1 }, { row: 1, spot: 1 }, { row: 2, spot: 1 }
   ],
   [
      { row: 0, spot: 2 }, { row: 1, spot: 2 }, { row: 2, spot: 2 }
   ]
];

const xValidator = [
   [
      { row: 0, spot: 0 }, { row: 1, spot: 1 }, { row: 2, spot: 2 }
   ],
   [
      { row: 0, spot: 2 }, { row: 1, spot: 1 }, { row: 2, spot: 0 }
   ]
];

export function validateBoard(board: ISpotInfo[][]) {
   if (validator(board, hValidator) ||
      validator(board, vValidator) ||
      validator(board, xValidator)) {
      return Status.win;
   }

   if (isFull(board)) {
      return Status.draw;
   }

   return Status.running;
}