import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from '../../shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { Faculty } from '../faculty/faculty.model';

@Component({
  selector: 'app-faculty',
  templateUrl: './faculty.component.html',
  styleUrls: ['./faculty.component.scss'],
})
export class FacultyComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  faculties: {};
  titleText: string;
  currentId: string;
  selectedTitle: string;
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
      .get(this.rootUrl + '/api/faculties', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.faculties = data.result;
      });
  }

  openModal(forEdit: boolean) {
    this.forEdit = forEdit;
  }

  openModalForEditing(faculty: Faculty) {
    this.titleText = faculty.title;
    this.currentId = faculty.id;
  }

  openModalForDelete(faculty: Faculty) {
    this.selectedTitle = faculty.title;
    this.currentId = faculty.id;
  }

  updateFaculty() {
    if (this.forEdit) {
      const body = {
        title: this.titleText,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/faculties/' + this.currentId,
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.titleText = '';
            this.toastr.success('Faculty updated!');
            this.http
              .get(this.rootUrl + '/api/faculties', this.requestOptions)
              .subscribe((data: ResponseAPI) => {
                console.log(data);
                this.faculties = data.result;
              });
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    } else {
      if (this.titleText) {
        const body = { title: this.titleText };
        console.log(JSON.stringify(body));
        return this.http
          .post(
            this.rootUrl + '/api/faculties',
            JSON.stringify(body),
            this.requestOptions
          )
          .subscribe((data: ResponseAPI) => {
            console.log(data);
            if (data.info.statusCode == 200) {
              this.titleText = '';
              this.toastr.success('Faculty created!');
              this.http
                .get(this.rootUrl + '/api/faculties', this.requestOptions)
                .subscribe((data: ResponseAPI) => {
                  console.log(data);
                  this.faculties = data.result;
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

  deleteFaculty(id: string) {
    return this.http
      .delete(this.rootUrl + '/api/faculties/' + id, this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('Faculty deleted!');
          this.http
            .get(this.rootUrl + '/api/faculties', this.requestOptions)
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.faculties = data.result;
            });
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
      });
  }
}
