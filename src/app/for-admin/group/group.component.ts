import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ResponseAPI } from 'src/app/shared/responseAPI';
import { ToastrService } from 'ngx-toastr';
import { Group } from './group.model';
import { Faculty } from '../faculty/faculty.model';
import { groupBy } from 'rxjs/internal/operators/groupBy';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  group: {};
  groups = {};
  groupsArray = [];
  filteredGroups = [];
  selectedGroup: string;
  selectedGroupTitle: string;
  selectedParentGroup: string;
  currentId: string;
  faculties: {};
  selectedFaculty: string;
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

  openModal(forEdit: boolean) {
    this.forEdit = forEdit;
  }

  openModalForEditing(group: Group) {
    this.selectedGroupTitle = group.title;
    this.selectedFaculty = group.faculty.id;
    if (group.parent) {
      this.selectedParentGroup = group.parent.id;
    }
    this.currentId = group.id;
  }

  openModalForDelete(group: Group) {
    this.selectedGroupTitle = group.title;
    this.currentId = group.id;
  }

  updateGroup() {
    if (this.forEdit) {
      const body = {
        title: this.selectedGroupTitle,
        faculty: this.selectedFaculty,
        parentGroup: this.selectedParentGroup,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/groups/' + this.currentId,
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.toastr.success('Group updated!');
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
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    } else {
      const body = {
        title: this.selectedGroupTitle,
        faculty: this.selectedFaculty,
        parentGroup: this.selectedParentGroup,
      };
      console.log(JSON.stringify(body));
      return this.http
        .post(
          this.rootUrl + '/api/groups',
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.toastr.success('Group created!');
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
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    }
  }

  deleteGroup() {
    return this.http
      .delete(
        this.rootUrl + '/api/groups/' + this.currentId,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('Group deleted!');
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
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
      });
  }
}
