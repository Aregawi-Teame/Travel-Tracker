import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
export class Refresh{
  loggedIn:boolean=false;
  isAdmin:boolean=false
  name!:string
}
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(public refresh:Refresh,private authService:AuthenticationService, private router:Router) { }
  ngOnInit(): void {
    this.refresh.loggedIn = this.authService.isLoggedIn()
    if(this.refresh.loggedIn){
      this.refresh.isAdmin = this.authService.isAdmin();
      this.refresh.name = this.authService.getName();
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['']);
    this.refresh.isAdmin = this.authService.isAdmin();
    this.refresh.loggedIn = this.authService.isLoggedIn()
  }

}
