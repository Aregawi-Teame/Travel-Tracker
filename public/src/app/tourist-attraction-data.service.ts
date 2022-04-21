import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TouristAttraction } from './add-tourist-attraction/add-tourist-attraction.component';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TouristAttractionDataService {
  baseUrl:string = environment.API_BASE_URL;
  prefix:string= environment.TRAVEL_HISTORIES;
  subPrefix:string = environment.TOURISTS;
  adminId!:string;
  
  constructor(private http:HttpClient, private authService:AuthenticationService) {
   }

  public addTouristAttraction(touristAttration:TouristAttraction, travel_history_id:string):Observable<any>{
    this.adminId = this.authService.getId();
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + this.authService.isAuthenticated().token)
    };
    return this.http.put(`${this.baseUrl}${this.prefix}/${travel_history_id}/${this.subPrefix}/${this.adminId}`,touristAttration,httpOptions);
  }
  public getTouristAttraction(travel_history_id:string,tourist_id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}${this.prefix}/${travel_history_id}/${this.subPrefix}/${tourist_id}`);
  }
  public updateTouristAttraction(travel_history_id:string,tourist_id:string,updatedTouristAttraction:TouristAttraction):Observable<any>{
    this.adminId = this.authService.getId();
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + this.authService.isAuthenticated().token)
    };
    return this.http.patch(`${this.baseUrl}${this.prefix}/${travel_history_id}/${this.subPrefix}/${tourist_id}/${this.adminId}`,updatedTouristAttraction,httpOptions);
  }
  public deleteTouristAttraction(travel_history_id:string,tourist_id:string):Observable<any>{
    this.adminId = this.authService.getId();
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + this.authService.isAuthenticated().token)
    };
    return this.http.delete(`${this.baseUrl}${this.prefix}/${travel_history_id}/${this.subPrefix}/${tourist_id}/${this.adminId}`,httpOptions);
  }
}
