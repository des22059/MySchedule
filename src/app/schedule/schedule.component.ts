import { Component, OnInit, NgModule } from '@angular/core';
import * as moment from 'moment';
import { DateService } from '../shared/date.service';
import { Lesson } from '../lesson';
import { LESSONS } from '../mock-lessons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ResponseAPI } from '../shared/responseAPI';

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
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  groups: {};
  selectedGroup: string;
  groupsArray = [];
  faculties: {};

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public dateService: DateService
  ) {
    this.headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }
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
  //currentWeekNumber = require('current-week-number');

  ngOnInit() {
    this.dateService.date.subscribe(this.generate.bind(this));
    this.http
      .get(this.rootUrl + '/api/groups', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.groups = data.result;
        this.groupsArray = [];
        for (let key in this.groups) {
          if (this.groups.hasOwnProperty(key)) {
            this.groupsArray.push(this.groups[key]);
          }
        }
        console.log('GroupsArray:');
        console.log(this.groupsArray);
      });
    this.http
      .get(this.rootUrl + '/api/faculties', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.faculties = data.result;
      });
  }

  go(dir: number) {
    this.dateService.changeWeek(dir);
    console.log(this.dateService.date);
  }

  onGroupSelect() {
    console.log('Group changed!');
    this.http
      .get(
        this.rootUrl + '/api/schedules?group=' + this.selectedGroup,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.faculties = data.result;
      });
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
