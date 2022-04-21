import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm')
  loginForm!:NgForm

  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  constructor(private authService:AuthenticationService, private route:Router) { }

  ngOnInit(): void {
  }

  login(loginForm:NgForm){
    console.log(loginForm.value)
    this.authService.login(loginForm.value).subscribe({
      next:result=>{
        console.log(result);
        this.success = true;
        const {token} = result
        this.authService.setToken(token);
        this.route.navigate(['/'],{queryParams : {login: 'success'}}).then(()=>window.location.reload())
        this.error = false;
        this.loginForm.reset()
      },
      error:err=>{
        console.log(err);
        this.error=true;
        this.success = false;
        this.errorMessage = err.error;
      },
      complete:()=>{
        console.log("Done!");
      }
    })
  }

}
