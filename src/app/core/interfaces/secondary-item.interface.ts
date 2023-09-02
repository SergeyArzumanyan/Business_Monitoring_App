import { FormControl } from "@angular/forms";

export interface ISecondaryItem {
  ID: number | null;
  Name: string | null;
  Price: number | null;
  Quantity: number;
  TotalPrice?: number;
}

export interface ISecondaryItemForm {
  ID: FormControl<number | null>;
  Name: FormControl<string | null>;
  Price: FormControl<number | null>;
}
