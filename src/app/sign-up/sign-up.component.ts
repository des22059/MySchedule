import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user.model';
import { NgForm } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseAPI } from '../shared/responseAPI';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  user = new User();
  headerDict: {};
  requestOptions: {};
  emailPattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  rolesSelector: {};

  constructor(
    private userService: UserService,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
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
    this.resetForm();
    this.http
      .get(this.rootUrl + '/api/role', this.requestOptions)
      .subscribe((data: ResponseAPI) => {
        //console.log(data);
        this.rolesSelector = data.result;
        console.log(this.rolesSelector);
      });
  }

  resetForm(form?: NgForm) {
    if (form) {
      form.reset();
      this.user = {
        login: '',
        password: '',
        mail: '',
        role: '',
      };
    }
  }
  //'6625810a-3655-4da2-b738-76f27e4d543b'
  OnSubmit(form: NgForm) {
    this.userService.registerUser(form.value).subscribe((data: ResponseAPI) => {
      console.log(data);

      if (data.info.statusCode == 200) {
        this.resetForm(form);
        this.toastr.success('User registration successful!');
      } else {
        this.toastr.error('Error: ' + data.info.statusCode.toString());
      }
    });
  }
}
