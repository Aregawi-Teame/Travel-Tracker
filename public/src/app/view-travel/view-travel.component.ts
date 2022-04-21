import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { TouristAttractionDataService } from '../tourist-attraction-data.service';
import { TravelsDataService } from '../travels-data.service';
import { Travel } from '../travels/travels.component';

@Component({
  selector: 'app-view-travel',
  templateUrl: './view-travel.component.html',
  styleUrls: ['./view-travel.component.css']
})
export class ViewTravelComponent implements OnInit {
  userInput!:string;
  isAdmin:boolean = false;
  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  constructor(public travel:Travel,private routes:ActivatedRoute,private authService:AuthenticationService,private touristAttractionData:TouristAttractionDataService, private travelHistroyData:TravelsDataService) { 
  }

  ngOnInit(): void {
    this.success=false;
    this.error=false;
    const travel_history_id = this.routes.snapshot.params["travel_history_id"];
    if(this.authService.isLoggedIn()){
      this.isAdmin = this.authService.isAdmin();
    }
    this.travelHistroyData.getTravel(travel_history_id).subscribe({
      next:travel_history=>this._onSuccessFullReturned(travel_history),
      error:err=>this._errorHandling(err),
      complete:()=>console.log("Done")
    })
  }
  _onSuccessFullReturned(travel:Travel){
    console.log("Data Found!", travel);
    this.travel = travel;
  }
  _errorHandling(err:any){
    console.log("Error!", err);
  }

  _onSuccessFulDataDeleted(result:any){
    this.ngOnInit();
    console.log(result);
    this.success = true;
    this.error = false;
  }
  _onDeleteErrorHandling(err:any){
    console.log(err);
    this.error=true;
    this.success = false;
    this.errorMessage = err.error.message;
  }
  onDelete(travel_history_id:string, tourist_attraction_id:string){
    this.touristAttractionData.deleteTouristAttraction(travel_history_id,tourist_attraction_id).subscribe({
      next:result=>this._onSuccessFulDataDeleted(result),
      error:err=>this._onDeleteErrorHandling(err),
      complete:()=>console.log("Done!")
    });
  }
}
