import { Component, OnInit, NgModule, ViewChild } from '@angular/core';
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
  @ViewChild('closebutton') closebutton;

  headerDict: {};
  requestOptions: {};

  forEdit = false;
  faculties: {};
  selectedFaculty: string;
  selectedModalFaculty: string;

  groups: {};
  groupsArray = [];
  selectedGroup: string;
  selectedModalGroup: string;

  audiences: {};
  selectedAudience: string;

  teachers: {};
  selectedTeacher = [];

  subjects: {};
  selectedSubject = [];

  lessonTypes: {};
  selectedLessonType = [];

  selectedWeekday: number;
  selectedLessonNumber: number;

  weekStart: number;
  weekEnd: number;

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
  lessons = {};
  lessonsArray = [];
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
      });
    this.http
      .get(this.rootUrl + '/api/faculties', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.faculties = data.result;
      });
    this.dateService.date.subscribe(this.generate.bind(this));
  }

  go(dir: number) {
    this.dateService.changeWeek(dir);
    this.http
      .get(
        this.rootUrl +
          '/api/schedules?week=' +
          this.dateService.date.value.week() +
          '&group=' +
          this.selectedGroup,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.lessons = data.result;
        this.lessonsArray = [];
        for (let key in this.lessons) {
          if (this.lessons.hasOwnProperty(key)) {
            this.lessonsArray.push(this.lessons[key]);
          }
        }
        this.dateService.date.subscribe(this.generate.bind(this));
      });
  }

  onFacultySelect() {
    if (this.selectedFaculty != 'Any') {
      this.http
        .get(
          this.rootUrl + '/api/groups?faculty=' + this.selectedFaculty,
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          this.groups = data.result;
          this.groupsArray = [];
          for (let key in this.groups) {
            if (this.groups.hasOwnProperty(key)) {
              this.groupsArray.push(this.groups[key]);
            }
          }
          if (this.groupsArray.length > 0) {
            this.selectedGroup = this.groupsArray[0].id;
            this.onGroupSelect();
          }
        });
    } else {
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
          if (this.groupsArray.length > 0) {
            this.selectedGroup = this.groupsArray[0].id;
            this.onGroupSelect();
          }
        });
    }
  }

  onGroupSelect() {
    console.log('Autochanged!');
    this.http
      .get(
        this.rootUrl +
          '/api/schedules?week=' +
          this.dateService.date.value.week() +
          '&group=' +
          this.selectedGroup,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.lessons = data.result;
        this.lessonsArray = [];
        for (let key in this.lessons) {
          if (this.lessons.hasOwnProperty(key)) {
            this.lessonsArray.push(this.lessons[key]);
          }
        }
        this.dateService.date.subscribe(this.generate.bind(this));
      });
  }

  onTeacherChange() {
    this.http
      .get(
        this.rootUrl + '/api/subjects?teacher=' + this.selectedTeacher,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.subjects = data.result;
      });
  }

  addLesson(weekday: number, lessonNumber: number) {
    this.selectedWeekday = weekday + 1;
    this.selectedLessonNumber = lessonNumber + 1;
    this.selectedModalFaculty = this.selectedFaculty;
    this.selectedModalGroup = this.selectedGroup;
    this.http
      .get(this.rootUrl + '/api/audiences', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        this.audiences = data.result;
        console.log(this.audiences);
      });
    this.http
      .get(this.rootUrl + '/api/teachers', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.teachers = data.result;
      });
    // this.http
    //   .get(this.rootUrl + '/api/subjects', this.requestOptions)
    //   .subscribe((data: ResponseAPI) => {
    //     console.log(data);
    //     this.subjects = data.result;
    //   });
    this.http
      .get(this.rootUrl + '/api/lesson_types', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.lessonTypes = data.result;
      });
  }

  onModalFacultySelect() {
    if (this.selectedModalFaculty != 'Any') {
      this.http
        .get(
          this.rootUrl + '/api/groups?faculty=' + this.selectedModalFaculty,
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          this.groups = data.result;
          this.groupsArray = [];
          for (let key in this.groups) {
            if (this.groups.hasOwnProperty(key)) {
              this.groupsArray.push(this.groups[key]);
            }
          }
        });
    } else {
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
        });
    }
  }

  updateLesson() {
    const body = {
      audience: this.selectedAudience,
      group: this.selectedModalGroup,
      teacher: this.selectedTeacher,
      subject: this.selectedSubject,
      lessonType: this.selectedLessonType,
      day: this.selectedWeekday,
      lessonNumber: this.selectedLessonNumber,
      weekStart: this.weekStart,
      weekEnd: this.weekEnd,
    };
    console.log(JSON.stringify(body));
    return this.http
      .post(
        this.rootUrl + '/api/schedules',
        JSON.stringify(body),
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('Lesson created!');
          this.http
            .get(
              this.rootUrl +
                '/api/schedules?week=' +
                this.dateService.date.value.week() +
                '&group=' +
                this.selectedGroup,
              this.requestOptions
            )
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.lessons = data.result;
              this.lessonsArray = [];
              for (let key in this.lessons) {
                if (this.lessons.hasOwnProperty(key)) {
                  this.lessonsArray.push(this.lessons[key]);
                }
              }
              this.dateService.date.subscribe(this.generate.bind(this));
            });
          this.closebutton.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
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

    this.lessonsArray.forEach((x) => {
      schedule[x.day - 1].weekLines[x.lessonNumber - 1].cells.push(x);
    });

    this.schedule = schedule;
  }
}
