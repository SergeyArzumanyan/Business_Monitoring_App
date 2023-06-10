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

import {
  AuthService,
  ToastService
} from "@Core/services";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canLoad(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: Route,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.authenticated.getValue() || sessionStorage.getItem('isAuthenticated')) {
      return true;
    } else {
      this.toastService.showToast('error', 'Error', 'Access Denied');
      this.router.navigateByUrl('auth');
      return false;
    }
  }

  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.authenticated.getValue() || sessionStorage.getItem('isAuthenticated')) {
      return true;
    } else {
      this.toastService.showToast('error', 'Error', 'Access Denied');
      this.router.navigateByUrl('auth');
      return false;
    }
  }


}
