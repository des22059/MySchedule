import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Response } from '@angular/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  constructor(private http: HttpClient) {}

  registerUser(user: User) {
    // let myHeaders = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    // myHeaders.set('Content-Type', 'application/json');

    // myRoles:

    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };
    console.log(user)
    const body: User = {
      login: user.login,
      password: user.password,
      mail: user.mail,
      role: user.role,
    };
    console.log(JSON.stringify(body));
    return this.http.post(
      this.rootUrl + '/api/user',
      JSON.stringify(body),
      requestOptions
    );
  }
}
