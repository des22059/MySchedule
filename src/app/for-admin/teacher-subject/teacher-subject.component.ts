import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from '../../shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { Teacher } from '../teachers/teacher.model';
import { Subject1 } from '../subjects/subject.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subj } from './teacher-subject.model';

@Component({
  selector: 'app-teacher-subject',
  templateUrl: './teacher-subject.component.html',
  styleUrls: ['./teacher-subject.component.scss'],
})
export class TeacherSubjectComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  subjects: {};
  teachers: {};
  teachersA = [];

  teacher: Teacher;
  selectedTeacher: string;
  teachersNoSubjects = [];

  disciplines = [];
  items = [];
  selected = [];

  currentId: string;
  forEdit = false;

  @ViewChild('closebutton') closebutton;
  @ViewChild('closebuttonDelete') closebuttonDelete;

  constructor(private http: HttpClient, private toastr: ToastrService) {
    this.headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    this.requestOptions = {
      headers: new HttpHeaders(this.headerDict),
    };
  }

  dataInit() {
    this.http
      .get(this.rootUrl + '/api/teachers', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        this.teachers = data.result;
        this.teachersA = [];
        for (let key in this.teachers) {
          if (this.teachers.hasOwnProperty(key)) {
            this.teachersA.push(this.teachers[key]);
          }
        }
        console.log(this.teachersA.length);
        this.teachersNoSubjects = [];
        this.teachersA.forEach((x) => {
          console.log(x.id);
          this.disciplines = [];
          this.http
            .get(
              this.rootUrl + '/api/subjects?teacher=' + x.id,
              this.requestOptions
            )
            .subscribe((data: ResponseAPI) => {
              this.disciplines.push({ teacher: x, subjects: data.result });
              let temp = [];
              temp = Object.keys(data.result).map(function (i) {
                let item = data.result[i];
                return item;
              });
              if (temp.length == 0) {
                this.teachersNoSubjects.push(x);
              }
              console.log('!!!');
              console.log(data.result);
            });
        });
      });
    this.http
      .get(this.rootUrl + '/api/subjects', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        this.subjects = data.result;
        this.items = [];
        for (let key in this.subjects) {
          if (this.subjects.hasOwnProperty(key)) {
            this.items.push(this.subjects[key]);
          }
        }
      });
  }

  ngOnInit(): void {
    this.dataInit();
  }

  ChangeTeacher() {
    this.http
      .get(
        this.rootUrl + '/api/subjects?teacher=' + this.selectedTeacher,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        this.subjects = data.result;
        let temp = [];
        for (let key in this.subjects) {
          if (this.subjects.hasOwnProperty(key)) {
            temp.push(this.subjects[key]);
          }
        }
        this.selected = [];
        temp.forEach((x) => {
          console.log(x.id);
          this.selected.push(x.id);
        });
      });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  openModal(forEdit: boolean) {
    this.forEdit = forEdit;
  }

  openModalForEditing(discipline: Subj) {
    this.selectedTeacher = discipline.teacher.id;
    this.currentId = discipline.teacher.id;
    this.selected = [];
    discipline.subjects.forEach((x) => {
      this.selected.push(x.id);
    });
  }

  openModalForDelete(teacher: Teacher) {
    this.currentId = teacher.id;
  }

  updateTS() {
    if (this.forEdit) {
      const body = {
        teacher: this.currentId,
        subjects: this.selected,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/disciplines',
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.toastr.success('Disciplines updated!');
            this.dataInit();
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    } else {
      const body = {
        teacher: this.selectedTeacher,
        subjects: this.selected,
      };
      console.log(JSON.stringify(body));
      return this.http
        .post(
          this.rootUrl + '/api/disciplines',
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.toastr.success('Disciplines created!');
            this.dataInit();
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    }
  }

  deleteTS() {
    return this.http
      .delete(
        this.rootUrl + '/api/disciplines/' + this.currentId,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('All disciplines deleted!');
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
        this.dataInit();
      });
  }
}
