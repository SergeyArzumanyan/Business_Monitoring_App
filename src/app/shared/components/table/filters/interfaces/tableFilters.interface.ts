import { FormControl } from "@angular/forms";

export interface ITableFilters {
  ShowName?: boolean;
  ShowPrice?: boolean;
}

export interface ITableFiltersForm {
  Name?: FormControl<string | null>;
  Price?: FormControl<number | null>;
}

export interface ITableFiltersObj {
  Name?: string | null;
  Price?: number | null;
}
