import { FormControl } from "@angular/forms";

export interface ITableFilters {
  ShowName?: boolean;
  ShowPrice?: boolean;
  ShowAddress?: boolean;
  ShowUsualAddress?: boolean;
  ShowPhoneNumber?: boolean;
}

export interface ITableFiltersForm {
  Name?: FormControl<string | null>;
  Price?: FormControl<number | null>;
  Address?: FormControl<string | null>;
  UsualAddress?: FormControl<string | null>;
  PhoneNumber?: FormControl<string | null>;
}

export interface ITableFiltersObj {
  Name?: string | null;
  Price?: number | null;
  ShowAddress?: string | null;
  ShowUsualAddress?: string | null;
  ShowPhoneNumber?: string | null;
}
