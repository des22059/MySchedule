import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from '../../shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { Subject } from '../subjects/subject.model';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  subjects: {};
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
      .get(this.rootUrl + '/api/subjects', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.subjects = data.result;
      });
  }

  log() {
    console.log(this.currentId);
  }

  openModal(forEdit: boolean) {
    this.forEdit = forEdit;
  }

  openModalForEditing(subject: Subject) {
    this.titleText = subject.title;
    this.currentId = subject.id;
  }

  openModalForDelete(subject: Subject) {
    this.selectedTitle = subject.title;
    this.currentId = subject.id;
  }

  updateSubject() {
    if (this.forEdit) {
      const body = {
        title: this.titleText,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/subjects/' + this.currentId,
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.titleText = '';
            this.toastr.success('Subject updated!');
            this.http
              .get(this.rootUrl + '/api/subjects', this.requestOptions)
              .subscribe((data: ResponseAPI) => {
                console.log(data);
                this.subjects = data.result;
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
            this.rootUrl + '/api/subjects',
            JSON.stringify(body),
            this.requestOptions
          )
          .subscribe((data: ResponseAPI) => {
            console.log(data);
            if (data.info.statusCode == 200) {
              this.titleText = '';
              this.toastr.success('Subjet created!');
              this.http
                .get(this.rootUrl + '/api/subjects', this.requestOptions)
                .subscribe((data: ResponseAPI) => {
                  console.log(data);
                  this.subjects = data.result;
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

  deleteSubject() {
    return this.http
      .delete(
        this.rootUrl + '/api/subjects/' + this.currentId,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('Subject deleted!');
          this.http
            .get(this.rootUrl + '/api/subjects', this.requestOptions)
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.subjects = data.result;
            });
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
      });
  }
}
