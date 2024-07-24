import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure:false
})
export class FilterPipe implements PipeTransform {

  transform(values: any, search:string) {
    let result = values?.filter((current)=>{
        return current.name.toUpperCase().includes(search.toUpperCase())
    })
    return result;
  }

}
