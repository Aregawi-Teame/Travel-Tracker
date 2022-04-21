import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TouristAttraction } from '../add-tourist-attraction/add-tourist-attraction.component';
import { AuthenticationService } from '../authentication.service';
import { NavigationComponent } from '../navigation/navigation.component';


import { TravelsDataService } from '../travels-data.service';
export class Travel{
  _id!:string;
  country!:string;
  population!:number;
  tourist_attractions!:TouristAttraction[];
  fillFromForm(travelHistoryForm:NgForm){
    this.country = travelHistoryForm.value.country
    this.population = travelHistoryForm.value.population
  }
}
@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.css']
})
export class TravelsComponent implements OnInit {
  input!:string;
  travels!:Travel[];
  isAdmin:boolean = false;
  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  constructor(private travelsDataService:TravelsDataService, private _router:ActivatedRoute, private authService:AuthenticationService) { }

  ngOnInit(): void {
    this.success=false;
    this.error=false;
    if(this.authService.isLoggedIn()){
      this.isAdmin = this.authService.isAdmin();
    }
    this.travelsDataService.getTravels().subscribe({
      next:travels_histrory=>this._onSuccessFullReturned(travels_histrory),
      error:err=>this._errorHandling(err),
      complete:()=>console.log("Successfully Done")
    })
  }

  _onSuccessFullReturned(travels:Travel[]){
    console.log("Data Found!", travels);
    this.travels = travels;
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
  onDelete(id:string){
    this.travelsDataService.deleteTravelHistroy(id).subscribe({
      next:result=>this._onSuccessFulDataDeleted(result),
      error:err=>this._onDeleteErrorHandling(err),
      complete:()=>console.log("Done!")
    })
  }

}
