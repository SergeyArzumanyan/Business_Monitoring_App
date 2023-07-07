import { Component, HostListener, Input } from '@angular/core';

import { ITableFilters } from "@Shared/components/filters/interfaces";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {

  public isMobile: boolean = (window.innerWidth <= 1000);
  @HostListener("window:resize", ["$event.target"])
  private onWindowResize(): void {
    this.isMobile = (window.innerWidth <= 1000);
  }

  @Input() TableFilters: ITableFilters | null = null;
}
