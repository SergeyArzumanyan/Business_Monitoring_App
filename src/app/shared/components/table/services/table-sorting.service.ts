import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TableSortingService {

  private ColumnSortStateCounter: number = 1;
  private FirstSortedColumnName: string = '';

  public ColumnSortState$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor() {}

  public SortTableField(ColumnName: any, NotSortedTableItems: any[]): any[] {

    return this.ApplySortToTable(this.DetermineSortType(ColumnName), NotSortedTableItems, ColumnName);
  }

  private DetermineSortType(ColumnName: string): string {
    if (!this.ColumnSortState$.getValue() && this.ColumnSortStateCounter === 4) {
      this.ColumnSortStateCounter = 1;
    }

    if (!this.ColumnSortState$.getValue()) {
      this.ColumnSortState$.next('asc');
    } else if (this.ColumnSortState$.getValue() === 'asc' && this.ColumnSortStateCounter === 2) {
      this.ColumnSortState$.next('desc');
    } else if (this.ColumnSortStateCounter === 3) {
      this.ColumnSortState$.next('');
    }

    this.ColumnSortStateCounter++;

    this.RestartSortingOnOtherFieldSort(ColumnName);

    return this.ColumnSortState$.getValue();
  }

  private RestartSortingOnOtherFieldSort(ColumnName: string): void {
    if (!this.FirstSortedColumnName) {
      this.FirstSortedColumnName = ColumnName;
    }

    if (this.FirstSortedColumnName !== ColumnName) {
      this.ColumnSortState$.next('asc');
      this.ColumnSortStateCounter = 2;
      this.FirstSortedColumnName = ColumnName;
    }
  }

  private ApplySortToTable(SortingType: string, TableItems: any[], ColumnName: string): any[] {
    const notSortedArr: any[] = Array.from(TableItems);

    if (SortingType === 'asc') {
      return notSortedArr.sort((a, b): number => {
        if (a[ColumnName] > b[ColumnName]) {
          return -1;
        }
        if (a[ColumnName] < b[ColumnName]) {
          return 1;
        }
        return 0;
      });
    } else if (SortingType === 'desc') {
      return notSortedArr.sort((a, b): number => {
        if (a[ColumnName] < b[ColumnName]) {
          return -1;
        }
        if (a.ColumnName > b.ColumnName) {
          return 1;
        }
        return 0;
      });
    } else {
      return [];
    }
  }

}
