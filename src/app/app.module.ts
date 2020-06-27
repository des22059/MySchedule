import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { ColorPickerModule } from '@syncfusion/ej2-angular-inputs';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SelectorComponent } from './selector/selector.component';
import { LessonComponent } from './lesson/lesson.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ForStudentsComponent } from './for-students/for-students.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MomentPipe } from './shared/moment.pipe';
import { WeekPipe } from './shared/moment.weekPipe';
import { ForTeachersComponent } from './for-teachers/for-teachers.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserService } from './shared/user.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ForAdminComponent } from './for-admin/for-admin.component';
import { BuildingsComponent } from './for-admin/buildings/buildings.component';
import { AudienceComponent } from './for-admin/audience/audience.component';
import { SubjectsComponent } from './for-admin/subjects/subjects.component';
import { FacultyComponent } from './for-admin/faculty/faculty.component';
import { TeachersComponent } from './for-admin/teachers/teachers.component';
import { LessonTypesComponent } from './for-admin/lesson-types/lesson-types.component';
import { TeacherSubjectComponent } from './for-admin/teacher-subject/teacher-subject.component';
import { NgSelectModule } from '@ng-select/ng-select';
<<<<<<< HEAD
import { GroupComponent } from './for-admin/group/group.component';
=======
import { UsersComponent } from './for-admin/users/users.component';
>>>>>>> Feature#5141

registerLocaleData(localeRu, 'ru');

const appRouts: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'for-students', component: ForStudentsComponent },
  { path: 'for-teachers', component: ForTeachersComponent },
  {
    path: 'for-admin',
    component: ForAdminComponent,
    children: [
      {
        path: 'audiences',
        component: AudienceComponent,
      },
      {
        path: 'buildings',
        component: BuildingsComponent,
      },
      {
        path: 'subjects',
        component: SubjectsComponent,
      },
      {
        path: 'faculties',
        component: FacultyComponent,
      },
      {
        path: 'teachers',
        component: TeachersComponent,
      },
      {
        path: 'lesson-types',
        component: LessonTypesComponent,
      },
      {
        path: 'teacher-subjects',
        component: TeacherSubjectComponent,
      },
      {
<<<<<<< HEAD
        path: 'groups',
        component: GroupComponent,
=======
        path: 'users',
        component: UsersComponent,
>>>>>>> Feature#5141
      },
    ],
  },
  { path: 'login', component: SignUpComponent },
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
    ForTeachersComponent,
    UserComponent,
    SignUpComponent,
    SignInComponent,
    ForAdminComponent,
    BuildingsComponent,
    AudienceComponent,
    SubjectsComponent,
    FacultyComponent,
    TeachersComponent,
    LessonTypesComponent,
    TeacherSubjectComponent,
<<<<<<< HEAD
    GroupComponent,
=======
    UsersComponent,
>>>>>>> Feature#5141
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRouts),
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ColorPickerModule,
    NgSelectModule,
  ],
  providers: [UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
