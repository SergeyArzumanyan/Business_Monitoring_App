import { Component, Input } from '@angular/core';

import { BehaviorSubject } from "rxjs";
import { AuthService } from "@Core/services";

@Component({
  selector: 'app-large-header',
  templateUrl: './large-header.component.html',
  styleUrls: ['./large-header.component.scss']
})
export class LargeHeaderComponent {
  @Input() isAlreadyAuthenticated: boolean = false

  public isAuthenticated: BehaviorSubject<boolean> = this.authService.authenticated;

  constructor(private authService: AuthService) {}

}
