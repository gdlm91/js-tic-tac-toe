import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

export enum Values {
   x = <any>'X',
   o = <any>'O',
   empty = <any>'-'
};

export enum Status {
   running = <any>'Corriendo',
   draw = <any>'Empate',
   win1 = <any>'Jugador 1 Ganador!',
   win2 = <any>'Jugador 2 Ganador!'
}

export interface ISpotInfo {
   row: number,
   spot: number,
   value?: Values
};

export interface IStore {
   board: [ISpotInfo[]],
   currentPlayer: number,
   status: Status
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
      let storeInfo = JSON.parse(JSON.stringify(this.storeInfo));
      const spot = storeInfo.board[spotInfo.row][spotInfo.spot];

      if (storeInfo.status !== Status.running || spot.value !== Values.empty) {
         return
      }

      spot.value = this.moves[storeInfo.currentPlayer];
      storeInfo.currentPlayer = Math.round((storeInfo.currentPlayer + 1) % 2);

      this.updateStore(storeInfo);
   }

   restart() {
      this.updateStore({
         board: this.getNewBoard(),
         currentPlayer: 0,
         status: Status.running
      });
   }

   private getNewBoard(): [ISpotInfo[]] {
      let board: [ISpotInfo[]] = <any>[];

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

   private checkStatus() {
      /** TODO: hacer validadores de Status */
   }

}

export const game = new Game();