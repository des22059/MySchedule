import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ResponseAPI } from 'src/app/shared/responseAPI';
import { User } from './user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  headerDict: {};
  requestOptions: {};

  users: {};
  usersArray = [];

  loginText: string;
  //passText: string;
  mailText: string;
  selectedRole: string;

  currentId: string;
  selectedUser: string;
  roles: {};
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
      .get(this.rootUrl + '/api/users', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.users = data.result;
      });
    this.usersArray = [];
    for (let key in this.users) {
      if (this.users.hasOwnProperty(key)) {
        this.usersArray.push(this.users[key]);
      }
    }
    this.http
      .get(this.rootUrl + '/api/roles', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        this.roles = data.result;
        console.log(this.roles);
      });
  }

  openModal(forEdit: boolean) {
    this.forEdit = forEdit;
  }

  openModalForEditing(user: User) {
    this.currentId = user.id;
    this.loginText = user.login;
    this.mailText = user.mail;
    this.selectedRole = user.role.id;
  }

  openModalForDelete(user: User) {
    this.loginText = user.login;
    this.currentId = user.id;
  }

  updateUser() {
    if (this.forEdit) {
      const body = {
        login: this.loginText,
        mail: this.mailText,
        password: 'I just put a little tricky on ya',
        role: this.selectedRole,
      };
      console.log(JSON.stringify(body));
      return this.http
        .put(
          this.rootUrl + '/api/users/' + this.currentId,
          JSON.stringify(body),
          this.requestOptions
        )
        .subscribe((data: ResponseAPI) => {
          console.log(data);
          if (data.info.statusCode == 200) {
            this.toastr.success('User updated!');
            this.http
              .get(this.rootUrl + '/api/users', this.requestOptions)
              .subscribe((data: ResponseAPI) => {
                console.log(data);
                this.users = data.result;
              });
            this.usersArray = [];
            for (let key in this.users) {
              if (this.users.hasOwnProperty(key)) {
                this.usersArray.push(this.users[key]);
              }
            }
            this.http
              .get(this.rootUrl + '/api/roles', this.requestOptions)
              .subscribe((data: ResponseAPI) => {
                console.log(data);
                this.roles = data.result;
                console.log(this.roles);
              });
            this.closebutton.nativeElement.click();
          } else {
            this.toastr.error('Error: ' + data.info.statusCode.toString());
          }
        });
    } else {
      if (this.loginText && this.mailText && this.selectedRole) {
        const body = {
          login: this.loginText,
          mail: this.mailText,
          password: 'I just put a little tricky on ya',
          role: this.selectedRole,
        };
        console.log(JSON.stringify(body));
        return this.http
          .post(
            this.rootUrl + '/api/users',
            JSON.stringify(body),
            this.requestOptions
          )
          .subscribe((data: ResponseAPI) => {
            console.log(data);
            if (data.info.statusCode == 200) {
              this.toastr.success('User created!');
              this.http
                .get(this.rootUrl + '/api/users', this.requestOptions)
                .subscribe((data: ResponseAPI) => {
                  console.log(data);
                  this.users = data.result;
                });
              this.usersArray = [];
              for (let key in this.users) {
                if (this.users.hasOwnProperty(key)) {
                  this.usersArray.push(this.users[key]);
                }
              }
              this.http
                .get(this.rootUrl + '/api/roles', this.requestOptions)
                .subscribe((data: ResponseAPI) => {
                  console.log(data);
                  this.roles = data.result;
                  console.log(this.roles);
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

  deleteUser() {
    return this.http
      .delete(
        this.rootUrl + '/api/users/' + this.currentId,
        this.requestOptions
      )
      .subscribe((data: ResponseAPI) => {
        console.log(data);
        if (data.info.statusCode == 200) {
          this.toastr.success('User deleted!');
          this.http
            .get(this.rootUrl + '/api/users', this.requestOptions)
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.users = data.result;
            });
          this.usersArray = [];
          for (let key in this.users) {
            if (this.users.hasOwnProperty(key)) {
              this.usersArray.push(this.users[key]);
            }
          }
          this.http
            .get(this.rootUrl + '/api/roles', this.requestOptions)
            .subscribe((data: ResponseAPI) => {
              console.log(data);
              this.roles = data.result;
              console.log(this.roles);
            });
          this.closebuttonDelete.nativeElement.click();
        } else {
          this.toastr.error('Error: ' + data.info.statusCode.toString());
        }
      });
  }
}
