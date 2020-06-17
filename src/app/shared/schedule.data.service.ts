import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class scheduleDataService {
  readonly rootUrl = 'https://my-schedule-2020.herokuapp.com';
  constructor(private http: HttpClient) {}
}
