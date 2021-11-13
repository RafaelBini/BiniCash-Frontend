import { UserService } from 'src/app/services/user.service';
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  constructor(
    private userService: UserService,
    private datePipe: DatePipe
  ) { }

  transform(value: string, format: string): string {
    return this.datePipe.transform(value, format, undefined, (this.userService.me.Configs['LANGUAGE'] || 'en-US')) || value
  }

}
