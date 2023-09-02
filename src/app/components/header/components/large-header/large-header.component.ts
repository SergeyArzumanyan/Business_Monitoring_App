import { Component, Input } from '@angular/core';

import { BehaviorSubject } from "rxjs";

import { AuthService, LanguageService } from "@Core/services";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-large-header',
  templateUrl: './large-header.component.html',
  styleUrls: ['./large-header.component.scss']
})
export class LargeHeaderComponent {
  @Input() isAlreadyAuthenticated: boolean = false

  public Configs = Configs;

  public isAuthenticated: BehaviorSubject<boolean> = this.authService.authenticated;

  constructor(
    private authService: AuthService,
    public languageService: LanguageService,
  ) {}
}
