import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { validateBoard } from './validators';

export enum Values {
   x = <any>'X',
   o = <any>'O',
   empty = <any>'-'
};

export enum Status {
   running = <any>'Corriendo',
   draw = <any>'Empate',
   win = <any>'Hay ganador'
}

export interface ISpotInfo {
   row: number,
   spot: number,
   value?: Values
};

export interface IStore {
   board: ISpotInfo[][],
   currentPlayer: number,
   status: Status
}

export function getSpot(board: ISpotInfo[][], { row, spot }): ISpotInfo {
   return board[row][spot];
}

class Game {
   private moves = [Values.x, Values.o];

   private storeSubject: BehaviorSubject<IStore>;

   private storeInfo;

   store$: Observable<IStore>;

   constructor() {
      this.storeSubject = new BehaviorSubject(<any>{});

      this.store$ = this.storeSubject.asObservable()
         .do(storeInfo => this.storeInfo = storeInfo);

      this.restart();
   }

   makeMove(spotInfo: ISpotInfo) {
      let storeInfo: IStore = JSON.parse(JSON.stringify(this.storeInfo));
      const spot = getSpot(storeInfo.board, spotInfo);

      if (storeInfo.status !== Status.running || spot.value !== Values.empty) {
         return
      }

      spot.value = this.moves[storeInfo.currentPlayer];
      storeInfo.currentPlayer = Math.round((storeInfo.currentPlayer + 1) % 2);
      storeInfo.status = this.getStatus(storeInfo.board);

      this.updateStore(storeInfo);;
   }

   restart() {
      this.updateStore({
         board: this.getNewBoard(),
         currentPlayer: 0,
         status: Status.running
      });
   }

   private getNewBoard(): ISpotInfo[][] {
      let board: ISpotInfo[][] = <any>[];

      for (var r = 0; r < 3; r++) {
         board[r] = [];
         for (var s = 0; s < 3; s++) {
            board[r].push({ row: r, spot: s, value: Values.empty });
         }
      }

      return board;
   }

   private updateStore(value) {
      this.storeSubject.next(value);
   }

   private getStatus(board) {
      return validateBoard(board);
   }

}

export const game = new Game();