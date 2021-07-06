import { UserService } from './../services/user.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Injectable({
  providedIn: 'root'
})


export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    try {
      await this.userService.isTokenValid().toPromise()
      return true;
    }
    catch (reason) {
      localStorage.removeItem('api_token')
      this.router.navigate(['login'])
      return false
    }


  }

}
