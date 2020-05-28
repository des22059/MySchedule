import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  public date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
  public dateWeekS: BehaviorSubject<moment.Moment> = new BehaviorSubject(
    moment()
  );
  public dateWeekE: BehaviorSubject<moment.Moment> = new BehaviorSubject(
    moment()
  );

  constructor() {
    let value = this.date.value;
    this.dateWeekE.next(value.clone().endOf('isoWeek'));
    this.dateWeekS.next(value.clone().startOf('isoWeek'));
  }

  changeWeek(dir: number) {
    let value = this.date.value.add(dir, 'week');
    this.date.next(value);
    this.dateWeekE.next(value.clone().endOf('isoWeek'));
    this.dateWeekS.next(value.clone().startOf('isoWeek'));
  }
}
