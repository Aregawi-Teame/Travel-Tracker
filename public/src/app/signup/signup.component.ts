import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../authentication.service';

export class User{
  _id:string;
  name:string;
  username:string;
  password:string;
  constructor(id:string, name:string, username:string, password:string){
    this._id = id;
    this.name = name;
    this.username = username;
    this.password = password;
  }

  get id():string{
    return this._id
  }
  getName():string{
    return this.name
  }
  getUsername():string{
    return this.username
  }
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  @ViewChild('signupForm')
  signupForm!:NgForm

  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  constructor(private authService:AuthenticationService) { }

  ngOnInit(): void {
  }

  addUser(signupForm:NgForm){
    console.log(signupForm.value)
    this.authService.addUser(signupForm.value).subscribe({
      next:result=>{
        console.log(result);
        this.success = true;
        this.error = false;
        this.signupForm.reset()
      },
      error:err=>{
        console.log(err);
        this.error=true;
        this.success = false;
        this.errorMessage = err.error.message;
      },
      complete:()=>{
        console.log("Done!");
      }
    })
  }

}
