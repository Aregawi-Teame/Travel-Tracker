import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { TravelsComponent } from './travels/travels.component';
import { CreateTravelHistoryComponent } from './create-travel-history/create-travel-history.component';
import { FormsModule } from '@angular/forms';
import { ViewTravelComponent } from './view-travel/view-travel.component';
import { AddTouristAttractionComponent } from './add-tourist-attraction/add-tourist-attraction.component';
import { EditTravelHistroyComponent } from './edit-travel-histroy/edit-travel-histroy.component';
import { TableFilterPipe } from './table-filter.pipe';
import { EditTouristAttractionComponent } from './edit-tourist-attraction/edit-tourist-attraction.component';
import { TouristAttractionFilterPipe } from './tourist-attraction-filter.pipe';
import { ErrorPageComponent } from './error-page/error-page.component';

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
    ErrorPageComponent
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
        path:"**",
        component: ErrorPageComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
