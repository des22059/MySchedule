import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

interface Lesson {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
}

interface Cell {
  lessons: Lesson[];
}

interface WeekLine {
  cells: Cell[];
}

interface Week {
  weekLines: WeekLine[];
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
