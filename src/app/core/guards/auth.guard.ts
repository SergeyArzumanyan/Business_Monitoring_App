import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route, Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from "@Services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(private authService: AuthService,private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.authenticated.getValue() || sessionStorage.getItem('isAuthenticated')) {
      return true;
    } else {
      console.log('Rejected.')
      this.router.navigateByUrl('auth');
      return false;
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.authenticated.getValue() || sessionStorage.getItem('isAuthenticated')) {
      return true;
    } else {
      console.log('Rejected.');
      this.router.navigateByUrl('auth');
      return false;
    }
  }


}
