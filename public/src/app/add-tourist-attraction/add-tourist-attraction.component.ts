import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { Refresh } from '../navigation/navigation.component';

import { TouristAttractionDataService } from '../tourist-attraction-data.service';
export class TouristAttraction{
  name!:string
  description!:string
  city!:string
  _id!:string
  fillFromForm(touristAttractionForm:NgForm){
    this.name = touristAttractionForm.value.name;
    this.description = touristAttractionForm.value.description;
    this.city = touristAttractionForm.value.city;
  }
}

@Component({
  selector: 'app-add-tourist-attraction',
  templateUrl: './add-tourist-attraction.component.html',
  styleUrls: ['./add-tourist-attraction.component.css']
})
export class AddTouristAttractionComponent implements OnInit {

  @ViewChild('addTouristAttractionForm')
  addTouristAttractionForm!:NgForm;
  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  travel_history_id!:string;
  isAdmin:boolean = false;
  constructor(private refresh:Refresh,private touristAttraction:TouristAttraction,private router:Router,private routes:ActivatedRoute,private authService:AuthenticationService, private touristAttractionService:TouristAttractionDataService) { }

  ngOnInit(): void {
    this.travel_history_id = this.routes.snapshot.params["travel_history_id"];
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
    this.success = false;
    this.error=false;
  }
  _redirectingUnAuthorizedUserToSigninFirst(){
    this.router.navigate(["/signin"])
    this.refresh.isAdmin = this.authService.isAdmin();
    this.refresh.loggedIn = this.authService.isLoggedIn();
  }
  _onSuccessFullDataSaved(result:any){
    this.success = true;
    this.error = false;
    this.addTouristAttractionForm.reset();
  }
  _errorHandling(err:any){
    console.log(err);
    this.error=true;
    this.success = false;
    this.errorMessage = err.error.message;
  }
  addTouristAttraction(addTouristAttractionForm:NgForm){
    this.touristAttraction.fillFromForm(addTouristAttractionForm);
    this.touristAttractionService.addTouristAttraction(this.touristAttraction,this.travel_history_id).subscribe({
      next:result=>this._onSuccessFullDataSaved(result),
      error:err=>this._errorHandling(err),
      complete:()=>console.log("Done!")
    })
  }  
}
