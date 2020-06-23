import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from '../../shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { Teacher } from '../teachers/teacher.model';
import { Subject } from '../subjects/subject.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Subj } from './ISubject.model';

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
  selectedTeacher: Teacher;

  disciplines = {};

  items = [];
  selected = [];

  surnameText: string;
  nameText: string;
  patronymicText: string;
  currentId: string;
  selectedSurname: string;
  selectedName: string;
  selectedPatronymic: string;
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

  ngOnInit(): void {
    this.http
      .get(this.rootUrl + '/api/teachers', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.teachers = data.result;
      });
    this.http
      .get(this.rootUrl + '/api/subjects', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.subjects = data.result;
        for (let key in this.subjects) {
          if (this.subjects.hasOwnProperty(key)) {
            this.items.push(this.subjects[key]);
          }
        }
        //this.selected = [this.items[0].id, this.items[1].id];
        //console.log(this.selected);
      });
    this.http
      .get(this.rootUrl + '/api/disciplines', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.disciplines = data.result;
        console.log(this.disciplines);
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

  openModalForEditing(teacher: Teacher) {
    this.surnameText = teacher.surname;
    this.nameText = teacher.name;
    this.patronymicText = teacher.patronymic;
    this.currentId = teacher.id;
  }

  openModalForDelete(teacher: Teacher) {
    this.selectedSurname = teacher.surname;
    this.selectedName = teacher.name;
    this.selectedPatronymic = teacher.patronymic;
    this.currentId = teacher.id;
  }

  updateTS() {
    if (this.forEdit) {
      const body = {
        surname: this.surnameText,
        name: this.nameText,
        patronymic: this.patronymicText,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/teachers/' + this.currentId,
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.surnameText = '';
            this.nameText = '';
            this.patronymicText = '';
            this.toastr.success('Teacher updated!');
            this.http
              .get(this.rootUrl + '/api/teachers', this.requestOptions)
              .subscribe((data: ResponseAPI) => {
                console.log(data);
                this.teachers = data.result;
              });
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    } else {
      if (this.surnameText && this.nameText && this.patronymicText) {
        const body = {
          surname: this.surnameText,
          name: this.nameText,
          patronymic: this.patronymicText,
        };
        console.log(JSON.stringify(body));
        return this.http
          .post(
            this.rootUrl + '/api/teachers',
            JSON.stringify(body),
            this.requestOptions
          )
          .subscribe((data: ResponseAPI) => {
            console.log(data);
            if (data.info.statusCode == 200) {
              this.surnameText = '';
              this.nameText = '';
              this.patronymicText = '';
              this.toastr.success('Teacher created!');
              this.http
                .get(this.rootUrl + '/api/teachers', this.requestOptions)
                .subscribe((data: ResponseAPI) => {
                  console.log(data);
                  this.teachers = data.result;
                });
              this.closebutton.nativeElement.click();
            } else {
              this.toastr.error('Error: ' + data.info.statusCode.toString());
            }
          });
      } else {
        this.toastr.error('Error: ' + 'please enter value properly');
      }
    }
  }

  deleteTS() {
    return this.http
      .delete(this.rootUrl + '/api/teachers/', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('Teacher deleted!');
          this.http
            .get(this.rootUrl + '/api/teachers', this.requestOptions)
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.teachers = data.result;
            });
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
      });
  }
}
