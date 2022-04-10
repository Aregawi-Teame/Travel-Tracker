import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  travel!:Travel;
  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  constructor(private route:ActivatedRoute,private travelHistoryData:TravelsDataService) { }

  ngOnInit(): void {
    this.travel_history_id = this.route.snapshot.params["travel_history_id"];
    this.success=false;
    this.error=false;
    this.travelHistoryData.getTravel(this.travel_history_id).subscribe({
      next:travel=>{
        this.editTravelHistoryForm.setValue({country:travel.country, population:travel.population})
      }
    })
  }
  editTravelHistroy(editTravelHistroyForm:NgForm){
    this.travelHistoryData.updateTravelHistory(this.travel_history_id,editTravelHistroyForm.value).subscribe({
      next:result=>{
        console.log(result);
        this.success = true;
        this.error = false;
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
