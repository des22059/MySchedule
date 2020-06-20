import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from '../../shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { Audience } from '../audience/audience.model';
import { Building } from '../buildings/building.model';
@Component({
  selector: 'app-audience',
  templateUrl: './audience.component.html',
  styleUrls: ['./audience.component.scss'],
})
export class AudienceComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  audience: {};
  buildings: {};
  audienceNumberText: string;
  building: string;

  currentBuilding: Building;
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

  ngOnInit(): void {
    this.http
      .get(this.rootUrl + '/api/audiences', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        this.audience = data.result;
        console.log(this.audience);
      });
    this.http
      .get(this.rootUrl + '/api/buildings', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        this.buildings = data.result;
        console.log(this.buildings);
      });
  }

  openModal(forEdit: boolean) {
    this.forEdit = forEdit;
  }

  log() {
    console.log(this.building);
  }

  openModalForEditing(audience: Audience) {
    //console.log(audience.building.title);
    this.currentId = audience.id;
    this.audienceNumberText = audience.audienceNumber;
    this.currentBuilding = audience.building;
    this.building = audience.building.id;
  }

  opemModalForDelete(audience: Audience) {
    this.audienceNumberText = audience.audienceNumber;
    this.currentId = audience.id;
  }

  updateAudience() {
    if (this.forEdit) {
      const body = {
        audienceNumber: this.audienceNumberText,
        building: this.building,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/audiences/' + this.currentId,
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.audienceNumberText = '';
            this.toastr.success('Audience updated!');
            this.http
              .get(this.rootUrl + '/api/audiences', this.requestOptions)
              .subscribe((data: ResponseAPI) => {
                console.log(data);
                this.audience = data.result;
              });
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    } else {
      if (this.audienceNumberText && this.building) {
        const body = {
          audienceNumber: this.audienceNumberText,
          building: this.building,
        };
        console.log(JSON.stringify(body));
        return this.http
          .post(
            this.rootUrl + '/api/audiences',
            JSON.stringify(body),
            this.requestOptions
          )
          .subscribe((data: ResponseAPI) => {
            console.log(data);
            if (data.info.statusCode == 200) {
              this.audienceNumberText = '';
              this.toastr.success('Audience created!');
              this.http
                .get(this.rootUrl + '/api/audiences', this.requestOptions)
                .subscribe((data: ResponseAPI) => {
                  console.log(data);
                  this.audience = data.result;
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

  deleteAudience(id: string) {
    return this.http
      .delete(this.rootUrl + '/api/audiences/' + id, this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('Audience deleted!');
          this.http
            .get(this.rootUrl + '/api/audiences', this.requestOptions)
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.audience = data.result;
            });
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
      });
  }
}
