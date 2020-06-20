import { Component, OnInit, NgModule } from '@angular/core';
import * as moment from 'moment';
import { DateService } from '../shared/date.service';
import { Lesson } from '../lesson';
import { LESSONS } from '../mock-lessons';

interface Cell {
  lessons: Lesson[];
}

interface WeekLine {
  cells: Cell[];
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit {
  constructor(public dateService: DateService) {}
  isAdmin = true;
  lessons = LESSONS;
  weekNames: string[] = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
  lessonsTime: string[] = [
    '8:45 - 10:20',
    '10:35 - 12:10',
    '12:25 - 14:00',
    '14:45 - 16:20',
    '16:35 - 18:10',
    '18:25 - 20:00',
    '20:15 - 21:50',
  ];
  schedule: WeekLine[];

  ngOnInit() {
    this.dateService.date.subscribe(this.generate.bind(this));
  }

  log() {
    console.log('Hover!');
  }

  generate(now: moment.Moment) {
    const schedule = [];
    for (let i = 0; i < 6; i++) {
      schedule.push({
        weekLines: Array(7)
          .fill(0)
          .map(() => {
            return {
              cells: Array().fill(0),
            };
          }),
      });
    }

    this.lessons.forEach((lesson) => {
      lesson.position.forEach((pos) => {
        schedule[lesson.day].weekLines[pos].cells.push(lesson);
      });
    });

    this.schedule = schedule;
  }
}
