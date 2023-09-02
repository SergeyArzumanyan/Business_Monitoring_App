import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import {
  AuthService,
  ToastService
} from "@Core/services";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public passwordInput: string = "";
  public isAuthenticated: boolean = this.authService.authenticated.getValue();
  public passwordIsInvalid: boolean = false;

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('link-pass')) {
      this.authService.checkPassword(Configs.AppPassword);
    }
  }

  public proceed(): void {
    if (this.passwordInput.trim()) {
      !this.authService.checkPassword(this.passwordInput) ? this.passwordIsInvalid = true : this.passwordIsInvalid = false;
    } else {
      this.toastService.showToast(
        'error',
        this.translateService.instant('Error'),
        this.translateService.instant('InputIsEmpty')
      );
    }
  }
}
