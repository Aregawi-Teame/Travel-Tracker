import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'touristAttractionFilter'
})
export class TouristAttractionFilterPipe implements PipeTransform {

  transform(tourist_attractions:any[],userInput:string){
    return userInput? tourist_attractions.filter(attraction=>attraction.name.toLowerCase().indexOf(userInput.toLowerCase())!=-1 || attraction.city.toLowerCase().indexOf(userInput.toLowerCase())!=-1) : tourist_attractions;
  }

}
