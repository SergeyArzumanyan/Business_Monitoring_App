import { FormControl } from "@angular/forms";

export interface IProduct {
  ID: number;
  TotalPrice?: number;
  Name: string;
  Price: number | null;
  Quantity: number;
}

export interface IProductForm {
  Name: FormControl<string | null>;
  Price: FormControl<number | null>;
}

export interface IProductForSending {
  ID: number;
  TotalPrice: number;
  Name: string;
  Price: number;
  Quantity: number | null;
}
