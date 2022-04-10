import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TouristAttractionDataService } from '../tourist-attraction-data.service';
import { TravelsDataService } from '../travels-data.service';
import { Travel } from '../travels/travels.component';

@Component({
  selector: 'app-view-travel',
  templateUrl: './view-travel.component.html',
  styleUrls: ['./view-travel.component.css']
})
export class ViewTravelComponent implements OnInit {
  travel!:Travel;

 

  constructor(private routes:ActivatedRoute,private touristAttractionData:TouristAttractionDataService, private travelHistroyData:TravelsDataService) { 
  }

  ngOnInit(): void {
    const travel_history_id = this.routes.snapshot.params["travel_history_id"];
    this.travelHistroyData.getTravel(travel_history_id).subscribe({
      next:travel_history=>{
        this.travel = travel_history;
      },
      error:err=>{
        console.log(err);
      },
      complete:()=>{
        console.log("Done");
      }
    })
  }
  onDelete(travel_history_id:string, tourist_attraction_id:string){
    this.touristAttractionData.deleteTouristAttraction(travel_history_id,tourist_attraction_id).subscribe(()=>this.ngOnInit());
  }
}
