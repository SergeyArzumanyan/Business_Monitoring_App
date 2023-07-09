import { Component, Input } from '@angular/core';

import { ITableFilters } from "@Shared/components/table/filters/interfaces";

@Component({
  selector: 'app-d-filters',
  templateUrl: './d-filters.component.html',
  styleUrls: ['./d-filters.component.scss']
})
export class DFiltersComponent {
  @Input() TableFilters: ITableFilters | null = null;
}
