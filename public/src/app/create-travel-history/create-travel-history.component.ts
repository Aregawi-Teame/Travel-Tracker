import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Refresh } from '../navigation/navigation.component';
import { TravelsDataService } from '../travels-data.service';
import { Travel } from '../travels/travels.component';
@Component({
  selector: 'app-create-travel-history',
  templateUrl: './create-travel-history.component.html',
  styleUrls: ['./create-travel-history.component.css']
})
export class CreateTravelHistoryComponent implements OnInit {
  @ViewChild('createTravelHistoryForm')
  createTravelHistroyForm!:NgForm;
  isAdmin:boolean = false;
  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  constructor(private refresh:Refresh,private travel:Travel,private travelHistoryDataService:TravelsDataService, private router:Router, private authService:AuthenticationService) {
    this.success = false;
    this.error=false;
   }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      if(this.authService.isAdmin()){
        this.isAdmin = true;
      }
      else{
        this.authService.logout();
        this._redirectingUnAuthorizedUserToSigninFirst()
      }
    }
    else{
      this.authService.logout();
      this._redirectingUnAuthorizedUserToSigninFirst()
    }
  }
  _redirectingUnAuthorizedUserToSigninFirst(){
    this.router.navigate(["/signin"])
    this.refresh.isAdmin = this.authService.isAdmin();
    this.refresh.loggedIn = this.authService.isLoggedIn();
  }
  _onSuccessFullDataSaved(result:any){
    console.log(result);
    this.success = true;
    this.error = false;
    this.createTravelHistroyForm.reset()
  }
  _errorHandling(err:any){
    console.log(err);
    this.error=true;
    this.success = false;
    this.errorMessage = err.error.message;
  }
  createTravelHistroy(createTravelHistoryForm:NgForm){
    console.log("createTraveHistroy controller called");
    this.travel.fillFromForm(createTravelHistoryForm);
    this.travelHistoryDataService.createTravelHistory(this.travel).subscribe({
      next:result=>this._onSuccessFullDataSaved(result),
      error:err=>this._errorHandling(err),
      complete:()=>console.log("Done!")
    })
 }
}
