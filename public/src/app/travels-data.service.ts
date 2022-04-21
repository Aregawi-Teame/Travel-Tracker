import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { environment } from 'src/environments/environment';

import { Travel } from './travels/travels.component';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TravelsDataService {
  baseUrl:string = environment.API_BASE_URL;
  prefix:string = environment.TRAVEL_HISTORIES;
  adminId!:string;
  constructor(private http:HttpClient, private authService:AuthenticationService) {
   }

  public getTravels(): Observable<Travel[]>{
    return this.http.get<Travel[]>(`${this.baseUrl}${this.prefix}`);
  }
  public getTravel(id:any):Observable<Travel>{
    return this.http.get<Travel>(`${this.baseUrl}${this.prefix}/${id}`);
  }
  public createTravelHistory(travel:Travel):Observable<Travel>{
    this.adminId = this.authService.getId();
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + this.authService.isAuthenticated().token)
    };
    return this.http.post<Travel>(`${this.baseUrl}${this.prefix}/${this.adminId}`,travel,httpOptions);
  }
  public updateTravelHistory(id:string, updatedTravel:Travel):Observable<any>{
    this.adminId = this.authService.getId();
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + this.authService.isAuthenticated().token)
    };
    return this.http.patch(`${this.baseUrl}${this.prefix}/${id}/${this.adminId}`, updatedTravel,httpOptions);
  }
  public deleteTravelHistroy(id:string):Observable<any>{
    this.adminId = this.authService.getId();
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + this.authService.isAuthenticated().token)
    };
    return this.http.delete(`${this.baseUrl}${this.prefix}/${id}/${this.adminId}`,httpOptions);
  }
}
