import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from '../../shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { Teacher } from '../teachers/teacher.model';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss'],
})
export class TeachersComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  teachers: {};
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

  updateTeacher() {
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

  deleteTeacher(id: string) {
    return this.http
      .delete(this.rootUrl + '/api/teachers/' + id, this.requestOptions)
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
