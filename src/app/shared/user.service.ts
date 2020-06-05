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

    const headerDict = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const requestOptions = {
      headers: new HttpHeaders(headerDict),
    };

    const body: User = {
      login: user.login,
      password: user.password,
      mail: user.mail,
      roles: ['6625810a-3655-4da2-b738-76f27e4d543b'],
    };
    console.log(JSON.stringify(body));
    return this.http.post(
      this.rootUrl + '/api/user',
      JSON.stringify(body),
      requestOptions
    );
  }
}
