import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sweets',
  templateUrl: './sweets.component.html'
})
export class SweetsComponent {
  public isMobile: boolean = window.innerWidth <= 900;

  @HostListener("window:resize", ["$event.target"])
  private onWindowResize(): void {
    this.isMobile = (window.innerWidth <= 900);
  }


}
