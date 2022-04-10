import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TouristAttractionDataService } from '../tourist-attraction-data.service';

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
  constructor(private routes:ActivatedRoute, private touristAttractionService:TouristAttractionDataService) { }

  ngOnInit(): void {
    this.travel_history_id = this.routes.snapshot.params["travel_history_id"];
    this.success = false;
    this.error=false;
  }

  addTouristAttraction(addTouristAttractionForm:NgForm){
    this.touristAttractionService.addTouristAttraction(addTouristAttractionForm.value,this.travel_history_id).subscribe({
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
