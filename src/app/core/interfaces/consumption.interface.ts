import { FormControl } from "@angular/forms";

export interface IConsumption {
  ID: number | null;
  DateOfPurchase: number | null;
  Name: string | null;
  Price: number | null;
}

export interface IConsumptionForm {
  ID: FormControl<number | null>;
  DateOfPurchase: FormControl<number | null>;
  Name: FormControl<string | null>;
  Price: FormControl<number | null>;
}
