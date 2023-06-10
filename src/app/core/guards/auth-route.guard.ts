import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { ToastService } from "@Core/services";

@Injectable({
  providedIn: 'root'
})
export class AuthRouteGuard implements CanActivate {

  constructor(private router: Router, private toastService: ToastService) {}

  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!sessionStorage.getItem('isAuthenticated')) {
      return true;
    } else {
      this.toastService.showToast('error', 'Error', 'Already Authenticated');
      this.router.navigateByUrl('sweets');
      return false;
    }
  }

}
