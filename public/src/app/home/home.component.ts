import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  logingSuccess!:boolean
  constructor(private _router:ActivatedRoute) { }

  ngOnInit(): void {
    if(this._router.snapshot.queryParams['login']=="success") this.logingSuccess=true;
  }

}
