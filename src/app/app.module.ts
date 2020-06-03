import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';

import { Routes, RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SelectorComponent } from './selector/selector.component';
import { LessonComponent } from './lesson/lesson.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForStudentsComponent } from './for-students/for-students.component';

import { MomentPipe } from './shared/moment.pipe';
import { WeekPipe } from './shared/moment.weekPipe';

registerLocaleData(localeRu, 'ru');

const appRouts: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'for-students', component: ForStudentsComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    SelectorComponent,
    MomentPipe,
    WeekPipe,
    LessonComponent,
    HomeComponent,
    PageNotFoundComponent,
    ForStudentsComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(appRouts)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
