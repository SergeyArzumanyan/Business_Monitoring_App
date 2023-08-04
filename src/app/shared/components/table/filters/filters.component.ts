import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

import { ITableFilters, ITableFiltersForm, ITableFiltersObj } from "@Shared/components/table/filters/interfaces";
import { onlyPositiveNumbers, onlyWhiteSpaceValidator } from "@Core/validators";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
})
export class FiltersComponent {

  public isMobile: boolean = (window.innerWidth <= 1000);
  @HostListener("window:resize", ["$event.target"])
  private onWindowResize(): void {
    this.isMobile = (window.innerWidth <= 1000);
  }

  @Input() TableFilters: ITableFilters | null = null;

  public TableFiltersForm: FormGroup<ITableFiltersForm> = new FormGroup<ITableFiltersForm>({
    Name: new FormControl<string | null>(null, [
      onlyWhiteSpaceValidator()
    ]),
    Price: new FormControl<number | null>(null, [
      onlyPositiveNumbers()
    ]),
    Address: new FormControl<string | null>(null, [
      onlyWhiteSpaceValidator()
    ]),
    UsualAddress: new FormControl<string | null>(null, [
      onlyWhiteSpaceValidator()
    ]),
    PhoneNumber: new FormControl<string | null>(null, [
      onlyWhiteSpaceValidator()
    ])
  })

  public Submitted: boolean = false;

  @Output() SendFiltersToTableComponent: EventEmitter<ITableFiltersObj> = new EventEmitter<ITableFiltersObj>()

  constructor() {}

  public getFiltersFromChildComponent(filters: ITableFiltersObj): void {
    this.SendFiltersToTableComponent.emit(filters);
  }

}
