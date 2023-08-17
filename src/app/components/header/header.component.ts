import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { AuthService } from "@Core/services";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  public isMobile: boolean = (window.innerWidth <= 1200);
  public isAuthenticated: BehaviorSubject<boolean> = this.authService.authenticated;
  public isAlreadyAuthenticated: boolean = !!sessionStorage.getItem('isAuthenticated');

  constructor(private authService: AuthService) {}

  @HostListener("window:resize", ["$event.target"])
  private onWindowResize(): void {
    this.isMobile = (window.innerWidth <= 1000);
  }

}
