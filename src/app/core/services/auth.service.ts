import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

import { ToastService } from "@Core/services";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public password: string = "Truffle2023";

  constructor(
    private router: Router,
    private toastService: ToastService,
    public translateService: TranslateService
  ) {}

  public checkPassword(inputedPassword: string): boolean {
    if (inputedPassword === this.password) {
      this.authenticated.next(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      this.router.navigateByUrl('sweets');
      this.toastService.showToast(
        'success',
        this.translateService.instant('Done'),
        this.translateService.instant('AuthSuccess')
      );
      return true;
    } else {
      this.authenticated.next(false);
      return false;
    }
  }

}
