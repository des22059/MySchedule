import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-for-admin',
  templateUrl: './for-admin.component.html',
  styleUrls: ['./for-admin.component.scss'],
})
export class ForAdminComponent implements OnInit {
  constructor(private router: Router) {}
  ngOnInit(): void {}
  toBuildings() {}
}
