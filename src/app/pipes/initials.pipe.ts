import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials'
})
export class InitialsPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return value.split(' ').splice(0, 2).map(w => w[0]).join('');
  }

}
