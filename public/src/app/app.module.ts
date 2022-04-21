import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { Travel, TravelsComponent } from './travels/travels.component';
import { CreateTravelHistoryComponent } from './create-travel-history/create-travel-history.component';
import { FormsModule } from '@angular/forms';
import { ViewTravelComponent } from './view-travel/view-travel.component';
import { AddTouristAttractionComponent, TouristAttraction } from './add-tourist-attraction/add-tourist-attraction.component';
import { EditTravelHistroyComponent } from './edit-travel-histroy/edit-travel-histroy.component';
import { TableFilterPipe } from './table-filter.pipe';
import { EditTouristAttractionComponent } from './edit-tourist-attraction/edit-tourist-attraction.component';
import { TouristAttractionFilterPipe } from './tourist-attraction-filter.pipe';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    FooterComponent,
    TravelsComponent,
    CreateTravelHistoryComponent,
    ViewTravelComponent,
    AddTouristAttractionComponent,
    EditTravelHistroyComponent,
    TableFilterPipe,
    EditTouristAttractionComponent,
    TouristAttractionFilterPipe,
    ErrorPageComponent,
    SignupComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path:"",
        component:HomeComponent
      },
      {
        path:"travels",
        component:TravelsComponent
      },
      {
        path:"create-travel-histroy",
        component:CreateTravelHistoryComponent
      },
      {
        path:"view/:travel_history_id",
        component:ViewTravelComponent
      },
      {
        path:"add/:travel_history_id",
        component:AddTouristAttractionComponent
      },
      {
        path:"edit/:travel_history_id",
        component:EditTravelHistroyComponent
      },
      {
        path:"edit/:travel_history_id/tourists/:tourist_id",
        component:EditTouristAttractionComponent
      },
      {
        path: "signup",
        component: SignupComponent
      },
      {
        path: "signin",
        component : LoginComponent
      },
      {
        path:"**",
        component: ErrorPageComponent
      }
    ])
  ],
  providers: [Travel,TouristAttraction,{provide: JWT_OPTIONS, useValue:JWT_OPTIONS},JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
