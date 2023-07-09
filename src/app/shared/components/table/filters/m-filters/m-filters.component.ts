import { Component, Input } from '@angular/core';

import { ITableFilters } from "@Shared/components/table/filters/interfaces";

@Component({
  selector: 'app-m-filters',
  templateUrl: './m-filters.component.html',
  styleUrls: ['./m-filters.component.scss']
})
export class MFiltersComponent {
  public isFilterOverlayVisible: boolean = false;

  @Input() TableFilters: ITableFilters | null = null;

  public toggleFilterOverlay(): void {
    this.isFilterOverlayVisible = !this.isFilterOverlayVisible;
  }
}
