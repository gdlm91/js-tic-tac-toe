import { el, list, mount } from 'redom';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { game, Values, ISpotInfo, IStore, Status } from './game';

class Spot {
      row: number;
      spot: number;
      el: any;

      constructor(clickCb) {
            this.el = el('td');
            this.el.onclick = () => clickCb({ row: this.row, spot: this.spot });
      }

      update({ row, spot, value }: ISpotInfo) {
            this.row = row;
            this.spot = spot;
            this.el.textContent = value;
      }
}

class Board {
      private el: any;
      private list: any;
      private subject: ReplaySubject<ISpotInfo> = new ReplaySubject();
      onClick$: Observable<ISpotInfo> = this.subject.asObservable();

      constructor() {
            this.el = el('table', { border: 2 });

            // Binding un callback al evento click de cada Spot
            this.list = list(this.el, list.extend('tr', Spot.bind(
                  undefined,
                  this.clickCb.bind(this))));
      }

      setValues(val) {
            this.list.update(val);
      }

      clickCb(spotInfo: ISpotInfo) {
            this.subject.next(spotInfo);
      }
}

export const board = new Board();
mount(document.getElementsByClassName('board')[0], board);

export const clearBtnClick$ = Observable.fromEvent(
      document.getElementsByClassName('clear')[0],
      'click');

game.store$.subscribe((newState: IStore) => {
      board.setValues(newState.board);
      setTimeout(() => {
            if (newState.status !== Status.running) {
                  alert(newState.status);
            }
      }, 50)
});
