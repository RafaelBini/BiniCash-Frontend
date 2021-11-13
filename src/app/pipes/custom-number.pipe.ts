import { UserService } from 'src/app/services/user.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'customNumber'
})
export class CustomNumberPipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
    private userService: UserService
  ) { }

  transform(value: string | number, ...args: unknown[]): unknown {
    return this.decimalPipe.transform(value, '1.2-2', this.userService.me.Configs['LANGUAGE'] || 'en-US');
  }

}
