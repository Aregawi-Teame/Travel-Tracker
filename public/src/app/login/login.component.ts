import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Refresh } from '../navigation/navigation.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm')
  loginForm!: NgForm;

  error!: boolean;
  errorMessage!: string;
  constructor(
    private refresh: Refresh,
    private authService: AuthenticationService,
    private route: Router
  ) {}

  ngOnInit(): void {}

  login(loginForm: NgForm) {
    console.log(loginForm.value);
    this.authService.login(loginForm.value).subscribe({
      next: (result) => this._onSuccessfullyLoggedin(result),
      error: (err) => this._errorHandle(err),
      complete: () => console.log('Done!'),
    });
  }

  _errorHandle(err: any) {
    console.log(err);
    this.error = true;
    this.errorMessage = err.error;
  }
  _onSuccessfullyLoggedin(result: any) {
    console.log(result);
    const { token } = result;
    this.authService.setToken(token);
    this.route.navigate(['/'], { queryParams: { login: 'success' } });
    this.refresh.isAdmin = this.authService.isAdmin();
    this.refresh.loggedIn = this.authService.isLoggedIn();
    this.refresh.name = this.authService.getName();
    this.error = false;
    this.loginForm.reset();
  }
}
