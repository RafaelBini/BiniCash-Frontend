import { Pipe, PipeTransform } from '@angular/core';
import { UserService } from '../services/user.service';

@Pipe({
  name: 'thousandSeparatorTranslate'
})
export class ThousandSeparatorTranslatePipe implements PipeTransform {

  constructor(
    private userService: UserService,
  ) {

  }

  transform(value: string, ...args: unknown[]): string {
    return (this.userService.me.Configs['LANGUAGE'] == 'pt-BR' ? '.' : value);
  }

}
