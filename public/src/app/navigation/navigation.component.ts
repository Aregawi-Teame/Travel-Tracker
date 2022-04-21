import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  loggedIn:boolean = false;
  isAdmin:boolean = false;
  name!:string
  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit(): void {
    this.loggedIn = this.authService.isLoggedIn()
    if(this.loggedIn){
      this.isAdmin = this.authService.isAdmin();
      this.name = this.authService.getName();
    }
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['']).then(()=>window.location.reload());
  }

}
