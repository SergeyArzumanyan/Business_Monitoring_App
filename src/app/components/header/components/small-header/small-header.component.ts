import { Component } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { AuthService } from "@Services/auth.service";

@Component({
  selector: 'app-small-header',
  templateUrl: './small-header.component.html',
  styleUrls: ['./small-header.component.scss']
})
export class SmallHeaderComponent {
  public menu: boolean = false;
  public isAuthenticated: BehaviorSubject<boolean> = this.authService.authenticated;
  public isAlreadyAuthenticated: boolean = !!sessionStorage.getItem('isAuthenticated');

  constructor(private authService: AuthService) {}


  public toggleMenu(): void {
    this.menu = !this.menu;
  }

  public closeMenu(): void {
    this.menu = false;
  }

}
