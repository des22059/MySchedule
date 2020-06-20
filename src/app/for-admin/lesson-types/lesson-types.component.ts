import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from '../../shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { LessonType } from '../lesson-types/lessonType.model';

@Component({
  selector: 'app-lesson-types',
  templateUrl: './lesson-types.component.html',
  styleUrls: ['./lesson-types.component.scss'],
})
export class LessonTypesComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  lessonTypes: {};
  typeText: string;
  colorText: string = '#000000ff';
  currentId: string;
  selectedType: string;
  selectedColor: string;
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
      .get(this.rootUrl + '/api/lesson_types', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.lessonTypes = data.result;
      });
  }

  openModal(forEdit: boolean) {
    this.forEdit = forEdit;
  }

  openModalForEditing(lessonType: LessonType) {
    this.typeText = lessonType.type;
    this.colorText = lessonType.color;
    this.currentId = lessonType.id;
  }

  openModalForDelete(lessonType: LessonType) {
    this.selectedType = lessonType.type;
    this.selectedColor = lessonType.color;
    this.currentId = lessonType.id;
  }

  updateLessonType() {
    if (this.forEdit) {
      const body = {
        type: this.typeText,
        color: this.colorText,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/lesson_types/' + this.currentId,
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.typeText = '';
            this.colorText = '';
            this.toastr.success('Lesson type updated!');
            this.http
              .get(this.rootUrl + '/api/lesson_types', this.requestOptions)
              .subscribe((data: ResponseAPI) => {
                console.log(data);
                this.lessonTypes = data.result;
              });
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    } else {
      if (this.typeText && this.colorText) {
        const body = { type: this.typeText, color: this.colorText };
        console.log(JSON.stringify(body));
        return this.http
          .post(
            this.rootUrl + '/api/lesson_types',
            JSON.stringify(body),
            this.requestOptions
          )
          .subscribe((data: ResponseAPI) => {
            console.log(data);
            if (data.info.statusCode == 200) {
              this.typeText = '';
              this.colorText = '';
              this.toastr.success('Lesson type created!');
              this.http
                .get(this.rootUrl + '/api/lesson_types', this.requestOptions)
                .subscribe((data: ResponseAPI) => {
                  console.log(data);
                  this.lessonTypes = data.result;
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

  deleteLessonType(id: string) {
    return this.http
      .delete(this.rootUrl + '/api/lesson_types/' + id, this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('Lesson type deleted!');
          this.http
            .get(this.rootUrl + '/api/lesson_types', this.requestOptions)
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.lessonTypes = data.result;
            });
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
      });
  }
}
