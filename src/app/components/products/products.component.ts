import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  public isMobile = window.innerWidth <= 900;

  @HostListener("window:resize", ["$event.target"])
  private onWindowResize(): void {
    this.isMobile = (window.innerWidth <= 900);
  }
}
