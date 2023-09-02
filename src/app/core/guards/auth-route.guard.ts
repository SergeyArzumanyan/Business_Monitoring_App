import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { ToastService } from "@Core/services";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Injectable({
  providedIn: 'root'
})
export class AuthRouteGuard implements CanActivate {

  constructor(
    private router: Router,
    private toastService: ToastService,
    public translateService: TranslateService
  ) {}

  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!sessionStorage.getItem('isAuthenticated')) {
      return true;
    } else {
      this.toastService.showToast(
        'error',
        this.translateService.instant('Error'),
        this.translateService.instant('AlreadyAuthenticated')
      );
      this.router.navigateByUrl(Configs.PrimaryItemRoute);
      return false;
    }
  }

}
