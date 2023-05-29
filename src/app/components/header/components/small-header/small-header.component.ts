import { Component, Input } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { AuthService } from "@Core/services";


@Component({
  selector: 'app-small-header',
  templateUrl: './small-header.component.html',
  styleUrls: ['./small-header.component.scss']
})
export class SmallHeaderComponent {
  @Input() isAlreadyAuthenticated: boolean = false

  public menu: boolean = false;
  public isAuthenticated: BehaviorSubject<boolean> = this.authService.authenticated;

  constructor(private authService: AuthService) {}

  public toggleMenu(): void {
    this.menu = !this.menu;
  }

  public closeMenu(): void {
    this.menu = false;
  }

}
