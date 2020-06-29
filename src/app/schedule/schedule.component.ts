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

  forEdit = false;
  faculties: {};

  groups: {};
  groupsArray = [];
  selectedGroup: string;

  audiences: {};
  selectedAudience: string;

  teachers: {};
  selectedTeacher = [];

  subjects: {};
  selectedSubject = [];

  lessonTypes: {};
  selectedLessonType = [];

  daterangepickerOptions = {
    startDate: null,
    endDate: null,
    format: 'DD.MM.YYYY',
    minDate: moment().add(-2, 'months').format('DD.MM.YYYY'),
    maxDate: moment().add(2, 'months').format('DD.MM.YYYY'),
    inactiveBeforeStart: true,
    autoApply: false,
    showRanges: true,
    preDefinedRanges: [
      {
        name: 'Day After tomorrow',
        value: {
          start: moment().add(2, 'days'),
          end: moment().add(2, 'days'),
        },
      },
      {
        name: 'Today',
        value: {
          start: moment(),
          end: moment(),
        },
      },
      {
        name: 'Tomorrow',
        value: {
          start: moment().add(1, 'days'),
          end: moment().add(1, 'days'),
        },
      },
      {
        name: 'This week',
        value: {
          start: moment(),
          end: moment().add(7, 'days'),
        },
      },
    ],
    singleCalendar: false,
    displayFormat: 'DD.MM.YYYY',
    position: 'left',
    disabled: false,
    noDefaultRangeSelected: true,
    disableBeforeStart: true,
  };

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

  addLesson() {
    console.log('Clicked!');
  }

  updateLesson() {}

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
