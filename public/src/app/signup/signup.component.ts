import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

export class User {
  _id!: string;
  name!: string;
  username!: string;
  password!: string;
  repeatPassword!: string;

  fillFromForm(userForm: NgForm) {
    this.name = userForm.value.name;
    this.username = userForm.value.username;
    this.password = userForm.value.password;
    this.repeatPassword = userForm.value.repeatPassword;
  }
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @ViewChild('signupForm')
  signupForm!: NgForm;

  success!: boolean;
  error!: boolean;
  errorMessage!: string;
  constructor(private user: User, private authService: AuthenticationService) {}

  ngOnInit(): void {}

  addUser(signupForm: NgForm) {
    console.log(signupForm.value);
    this.user.fillFromForm(signupForm);
    this.authService.addUser(this.user).subscribe({
      next: (result) => this._onSuccessfullyRegistered(result),
      error: (err) => this._errorHandle(err),
      complete: () => console.log('Done!'),
    });
  }
  _onSuccessfullyRegistered(result: any) {
    console.log(result);
    this.success = true;
    this.error = false;
    this.signupForm.reset();
  }
  _errorHandle(err: any) {
    console.log(err);
    this.error = true;
    this.success = false;
    this.errorMessage = err.error.message;
  }
}
