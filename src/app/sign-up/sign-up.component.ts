import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user.model';
import { NgForm } from '@angular/forms';
import { UserService } from '../shared/user.service';
import { ToastrService } from 'ngx-toastr';
import { ResponseAPI } from '../shared/responseAPI';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  user = new User();
  emailPattern: '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  rolesSelector = [{id:"1id", role: "Admin"}, {id:"2id", role: "Worker"}, {id:"3id", role: "TestRole"}]
  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.resetForm();
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
