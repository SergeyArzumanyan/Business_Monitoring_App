import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-m-filters',
  templateUrl: './m-filters.component.html',
  styleUrls: ['./m-filters.component.scss']
})
export class MFiltersComponent {
  public isFilterOverlayVisible: boolean = false;

  @Input() showName: boolean = false;
  @Input() showPrice: boolean = false;

  public toggleFilterOverlay(): void {
    this.isFilterOverlayVisible = !this.isFilterOverlayVisible;
  }
}
