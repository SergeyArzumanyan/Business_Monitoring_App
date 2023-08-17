import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import {
  ITableFilters,
  ITableFiltersForm,
  ITableFiltersObj,
} from "@Shared/components/table/filters/interfaces";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'app-d-filters',
  templateUrl: './d-filters.component.html',
  styleUrls: ['./d-filters.component.scss']
})
export class DFiltersComponent implements AfterViewInit, OnDestroy {
  @Input() TableFilters: ITableFilters | null = null;
  @Input() FiltersForm: FormGroup<ITableFiltersForm> = new FormGroup<ITableFiltersForm>({});
  @Input() Submitted: boolean = false;
  @Output() FiltersChanged: EventEmitter<ITableFiltersObj> = new EventEmitter<ITableFiltersObj>();

  public FiltersChangedState: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(public translateService: TranslateService) {}

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
      })
  }

  public applyFilters(): void {
    if (this.FiltersForm.valid) {
      this.FiltersChanged.emit(this.FiltersForm.value)
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
    this.applyFilters();
  }
}
