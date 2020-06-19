import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from '../../shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { Building } from '../buildings/building.model';

@Component({
  selector: 'app-buildings',
  templateUrl: './buildings.component.html',
  styleUrls: ['./buildings.component.scss'],
})
export class BuildingsComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  buildings: {};
  titleText: string;
  addressText: string;
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
      .get(this.rootUrl + '/api/buildings', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.buildings = data.result;
      });
  }

  openModal(forEdit: boolean) {
    this.forEdit = forEdit;
  }

  openModalForEditing(building: Building) {
    this.titleText = building.title;
    this.addressText = building.address;
    this.currentId = building.id;
  }

  opemModalForDelete(building: Building) {
    this.selectedTitle = building.title;
    this.currentId = building.id;
  }

  updateBuilding() {
    if (this.forEdit) {
      const body = {
        title: this.titleText,
        address: this.addressText,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/buildings/' + this.currentId,
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.titleText = '';
            this.addressText = '';
            this.toastr.success('Building updated!');
            this.http
              .get(this.rootUrl + '/api/buildings', this.requestOptions)
              .subscribe((data: ResponseAPI) => {
                console.log(data);
                this.buildings = data.result;
              });
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    } else {
      if (this.titleText && this.addressText) {
        const body = { title: this.titleText, address: this.addressText };
        console.log(JSON.stringify(body));
        return this.http
          .post(
            this.rootUrl + '/api/buildings',
            JSON.stringify(body),
            this.requestOptions
          )
          .subscribe((data: ResponseAPI) => {
            console.log(data);
            if (data.info.statusCode == 200) {
              this.titleText = '';
              this.addressText = '';
              this.toastr.success('Building created!');
              this.http
                .get(this.rootUrl + '/api/buildings', this.requestOptions)
                .subscribe((data: ResponseAPI) => {
                  console.log(data);
                  this.buildings = data.result;
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

  deleteBuilding(id: string) {
    return this.http
      .delete(
        this.rootUrl + '/api/buildings/' + this.currentId,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('Building deleted!');
          this.http
            .get(this.rootUrl + '/api/buildings', this.requestOptions)
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.buildings = data.result;
            });
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
      });
  }
}
