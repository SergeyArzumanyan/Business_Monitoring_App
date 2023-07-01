import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-d-filters',
  templateUrl: './d-filters.component.html',
  styleUrls: ['./d-filters.component.scss']
})
export class DFiltersComponent {
  @Input() showName: boolean = false;
  @Input() showPrice: boolean = false;

}
