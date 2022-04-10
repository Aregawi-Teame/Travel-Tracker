import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http'
import { environment } from 'src/environments/environment';

import { Travel } from './travels/travels.component';

@Injectable({
  providedIn: 'root'
})
export class TravelsDataService {
  baseUrl:string = environment.API_BASE_URL;
  prefix:string = environment.TRAVEL_HISTORIES;
  constructor(private http:HttpClient) { }

  public getTravels(): Observable<Travel[]>{
    return this.http.get<Travel[]>(`${this.baseUrl}${this.prefix}`);
  }
  public getTravel(id:any):Observable<Travel>{
    return this.http.get<Travel>(`${this.baseUrl}${this.prefix}/${id}`);
  }
  public createTravelHistory(travel:Travel):Observable<any>{
    return this.http.post(`${this.baseUrl}${this.prefix}`,travel);
  }
  public updateTravelHistory(id:string, updatedInfo:any):Observable<any>{
    return this.http.patch(`${this.baseUrl}${this.prefix}/${id}`, updatedInfo);
  }
  public deleteTravelHistroy(id:string):Observable<any>{
    return this.http.delete(`${this.baseUrl}${this.prefix}/${id}`);
  }
}
