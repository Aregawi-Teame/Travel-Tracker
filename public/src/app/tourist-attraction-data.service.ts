import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TouristAttractionDataService {
  baseUrl:string = environment.API_BASE_URL;
  prefix:string= environment.TRAVEL_HISTORIES;
  subPrefix:string = environment.TOURISTS;
  constructor(private http:HttpClient) { }

  public addTouristAttraction(touristAttration:any, travel_history_id:string):Observable<any>{
    return this.http.put(`${this.baseUrl}${this.prefix}/${travel_history_id}/${this.subPrefix}`,touristAttration);
  }
  public getTouristAttraction(travel_history_id:string,tourist_id:string):Observable<any>{
    return this.http.get(`${this.baseUrl}${this.prefix}/${travel_history_id}/${this.subPrefix}/${tourist_id}`);
  }
  public updateTouristAttraction(travel_history_id:string,tourist_id:string,tourist_attraction:any):Observable<any>{
    return this.http.patch(`${this.baseUrl}${this.prefix}/${travel_history_id}/${this.subPrefix}/${tourist_id}`,tourist_attraction);
  }
  public deleteTouristAttraction(travel_history_id:string,tourist_id:string):Observable<any>{
    return this.http.delete(`${this.baseUrl}${this.prefix}/${travel_history_id}/${this.subPrefix}/${tourist_id}`);
  }
}
