import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TouristAttraction } from '../add-tourist-attraction/add-tourist-attraction.component';
import { AuthenticationService } from '../authentication.service';

import { TouristAttractionDataService } from '../tourist-attraction-data.service';

@Component({
  selector: 'app-edit-tourist-attraction',
  templateUrl: './edit-tourist-attraction.component.html',
  styleUrls: ['./edit-tourist-attraction.component.css']
})
export class EditTouristAttractionComponent implements OnInit {
  travel_history_id!:string;
  tourist_id!:string;
  @ViewChild('editTouristAttractionForm')
  editTouristAttractionForm!:NgForm;
  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  isAdmin:boolean =false;
  constructor(private touristAttraction:TouristAttraction,private authService:AuthenticationService, private router:Router, private route:ActivatedRoute,private touristAttractionService:TouristAttractionDataService) { }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      if(this.authService.isAdmin()){
        this.isAdmin = true;
        this.travel_history_id = this.route.snapshot.params["travel_history_id"];
        this.tourist_id = this.route.snapshot.params["tourist_id"];
        this.success=false;
        this.error=false;
        this.touristAttractionService.getTouristAttraction(this.travel_history_id,this.tourist_id).subscribe({
        next:tourist_attraction=>{
          this.editTouristAttractionForm.setValue({name:tourist_attraction.name, city:tourist_attraction.city,description:tourist_attraction.description})
        }
        })
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
    this.router.navigate(["/signin"]).then(()=>window.location.reload())
  }
  _onSuccessFullDataSaved(result:any){
    console.log(result);
    this.success = true;
    this.error = false;
  }
  _errorHandling(err:any){
    console.log(err);
    this.error=true;
    this.success = false;
    this.errorMessage = err.error.message;
  }
  editTouristAttraction(editTouristAttractionForm:NgForm){
    this.touristAttraction.fillFromForm(editTouristAttractionForm)
    this.touristAttractionService.updateTouristAttraction(this.travel_history_id,this.tourist_id,this.touristAttraction).subscribe({
      next:result=>this._onSuccessFullDataSaved(result),
      error:err=>this._errorHandling(err),
      complete:()=>console.log("Done!")
    })
  }

}
