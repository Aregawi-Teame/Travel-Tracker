import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  #name:string = "Unkown";
  #isLoggedIn:boolean = false;
  #isAdmin:boolean = false;
  #id!:string;

  baseUrl:string = environment.API_BASE_URL;
  constructor(private http:HttpClient, private _jwtService: JwtHelperService) { }
  getId(){
    if(this.isAuthenticated()) return this._jwtService.decodeToken(this.getToken())._id;
    return "invalid";
  }
  getToken(){
    if(this.isAuthenticated()) return localStorage.getItem(environment.token_storage_key) as string
    return "Unauthorized"
  }
  isAdmin(){
    if(this.isAuthenticated()) return this._jwtService.decodeToken(this.getToken()).isAdmin;
    return this.#isAdmin;
  }
  getName(){
    if(this.isAuthenticated()) return this._jwtService.decodeToken(this.getToken()).name;
    return this.#name
  }
  isLoggedIn(){
    if(this.isAuthenticated()) return true;
    return this.#isLoggedIn;
  }
  public setToken(token:string){
    localStorage.setItem(environment.token_storage_key, JSON.stringify({token}));
  }

  public addUser(user:any):Observable<any>{
    return this.http.post(this.baseUrl+'users', user);
  }
  
  public login(user:any):Observable<any>{
    return this.http.post(this.baseUrl+'auths/login', user)
  }

  public isAuthenticated(){
    if(typeof window == 'undefined'){
        return false;
    }
    if(localStorage.getItem(environment.token_storage_key)){
        return JSON.parse(localStorage.getItem(environment.token_storage_key) as string );
    }
    else{
        return false;
    }
};

public logout(){
  localStorage.removeItem(environment.token_storage_key);
  this.#isLoggedIn = false
  //return this.http.get(this.baseUrl+'auths/logout')
}
}

