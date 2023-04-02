import { Component } from '@angular/core';

@Component({
  selector: 'app-small-header',
  templateUrl: './small-header.component.html',
  styleUrls: ['./small-header.component.scss']
})
export class SmallHeaderComponent {
  public menu: boolean = false;

  public toggleMenu(): void {
    this.menu = !this.menu;
    console.log("453456464646");
  }
}
