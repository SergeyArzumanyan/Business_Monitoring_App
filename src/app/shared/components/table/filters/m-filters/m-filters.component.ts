import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import {
  ITableFilters,
  ITableFiltersForm,
  ITableFiltersObj,
} from "@Shared/components/table/filters/interfaces";


@Component({
  selector: 'app-m-filters',
  templateUrl: './m-filters.component.html',
  styleUrls: ['./m-filters.component.scss']
})
export class MFiltersComponent implements AfterViewInit, OnDestroy {
  public isFilterOverlayVisible: boolean = false;

  @Input() TableFilters: ITableFilters | null = null;
  @Input() FiltersForm: FormGroup<ITableFiltersForm> = new FormGroup<ITableFiltersForm>({});
  @Input() Submitted: boolean = false;
  @Output() FiltersChanged: EventEmitter<ITableFiltersObj> = new EventEmitter<ITableFiltersObj>();

  public toggleFilterOverlay(): void {
    this.isFilterOverlayVisible = !this.isFilterOverlayVisible;
  }

  public FiltersChangedState: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor() {}

  ngAfterViewInit(): void {
    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private subscribeToFormChanges(): void {
    this.FiltersForm.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (formValues: Partial<ITableFiltersObj>): void => {
          this.FiltersChangedState = !Object.values(formValues).every((filterValue) => !filterValue);
        }
      });
  }

  public applyFilters(DontCloseFiltersOverlayOnClear?: boolean): void {
    if (this.FiltersForm.valid) {
      this.FiltersChanged.emit(this.FiltersForm.value);
      this.isFilterOverlayVisible = !!DontCloseFiltersOverlayOnClear;
    }
  }

  public resetFilters(): void {
    for (const control of Object.values(this.FiltersForm.controls)) {
      if (typeof(control.value) === 'string') {
        control.setValue('');
      } else {
        control.setValue(null);
      }
    }
    this.applyFilters(true);
  }
}
