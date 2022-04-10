import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {

  transform(travels: any[], userInput: string){

    return userInput ? travels.filter(travel=>travel.country.toLowerCase().indexOf(userInput.toLowerCase())!=-1):travels;
  }

}
