import { Component, OnInit } from '@angular/core';


import { TravelsDataService } from '../travels-data.service';
export class Travel{
  #_id!:string;
  #country!:string;
  #population!:number;
  #tourist_attractions!:any[];
  constructor(id:string,country:string,population:number){
    this.#_id=id;
    this.#country=country;
    this.#population = population;
  }
  get _id():string {return this.#_id}
  get country():string{return this.country}
  get population():string{return this.population}
  get tourist_attractions():any[]{return this.#tourist_attractions}
}
@Component({
  selector: 'app-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.css']
})
export class TravelsComponent implements OnInit {
  input!:string;
  travels!:Travel[];

  success!:boolean;
  error!:boolean;
  errorMessage!:string;
  constructor(private travelsDataService:TravelsDataService) { }

  ngOnInit(): void {
    this.success=false;
    this.error=false;
    this.travelsDataService.getTravels().subscribe({
      next:travels_histrory=>{
        console.log("Data Found!", travels_histrory);
        this.travels = travels_histrory;
      },
      error:err=>{
        console.log("Error!", err);
      },
      complete:()=>{
        console.log("Successfully Done");
        
      }
    })
  }

  onDelete(id:string){
    this.travelsDataService.deleteTravelHistroy(id).subscribe({
      next:result=>{
        this.ngOnInit();
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
