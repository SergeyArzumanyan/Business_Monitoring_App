import { FormControl } from "@angular/forms";

export interface IProduct {
  ID: number | null;
  Name: string | null;
  Price: number | null;
  Quantity: number;
  TotalPrice?: number;
}

export interface IProductForm {
  ID: FormControl<number | null>;
  Name: FormControl<string | null>;
  Price: FormControl<number | null>;
}
