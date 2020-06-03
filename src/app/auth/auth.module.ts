import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  declarations: [LoginComponent, ResetPasswordComponent],
  imports: [CommonModule, AuthRoutingModule],
  exports: [LoginComponent, ResetPasswordComponent],
})
export class AuthModule {}
