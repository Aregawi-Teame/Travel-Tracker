import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { TravelsDataService } from '../travels-data.service';
import { Travel } from '../travels/travels.component';

@Component({
  selector: 'app-edit-travel-histroy',
  templateUrl: './edit-travel-histroy.component.html',
  styleUrls: ['./edit-travel-histroy.component.css']
})
export class EditTravelHistroyComponent implements OnInit {

  travel_history_id!:string;
  @ViewChild('editTravelHistoryForm')
  editTravelHistoryForm!:NgForm;
  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  isAdmin:boolean = false;
  constructor(private travel:Travel,private authService:AuthenticationService, private router:Router, private route:ActivatedRoute,private travelHistoryData:TravelsDataService) { }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      if(this.authService.isAdmin()){
        this.isAdmin = true;
        this.isAdmin = true;
        this.travel_history_id = this.route.snapshot.params["travel_history_id"];
        this.success=false;
        this.error=false;
        this.travelHistoryData.getTravel(this.travel_history_id).subscribe({
          next:travel=>{
            this.editTravelHistoryForm.setValue({country:travel.country, population:travel.population})
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
  editTravelHistroy(editTravelHistroyForm:NgForm){
    this.travel.fillFromForm(editTravelHistroyForm)
    this.travelHistoryData.updateTravelHistory(this.travel_history_id,this.travel).subscribe({
      next:result=>this._onSuccessFullDataSaved(result),
      error:err=>this._errorHandling(err),
      complete:()=>console.log("Done!")
    })
  }

}
