import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TravelsDataService } from '../travels-data.service';
@Component({
  selector: 'app-create-travel-history',
  templateUrl: './create-travel-history.component.html',
  styleUrls: ['./create-travel-history.component.css']
})
export class CreateTravelHistoryComponent implements OnInit {
  @ViewChild('createTravelHistoryForm')
  createTravelHistroyForm!:NgForm;

  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  constructor(private travelHistoryDataService:TravelsDataService) {
    this.success = false;
    this.error=false;
   }

  ngOnInit(): void {
    setTimeout(() =>{this.createTravelHistroyForm.setValue({country:"",population:""})
    }, 0);
  }
  createTravelHistroy(createTravelHistoryForm:NgForm){
    console.log("createTraveHistroy controller called");
    this.travelHistoryDataService.createTravelHistory(createTravelHistoryForm.value).subscribe({
      next:result=>{
        console.log(result);
        this.success = true;
        this.error = false;
        this.ngOnInit();
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
