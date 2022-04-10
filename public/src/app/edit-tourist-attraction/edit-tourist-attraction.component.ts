import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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
  constructor(private route:ActivatedRoute,private touristAttractionService:TouristAttractionDataService) { }

  ngOnInit(): void {
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
  editTouristAttraction(editTouristAttractionForm:NgForm){
    this.touristAttractionService.updateTouristAttraction(this.travel_history_id,this.tourist_id,editTouristAttractionForm.value).subscribe({
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
