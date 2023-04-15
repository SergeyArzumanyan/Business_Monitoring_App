import { FormControl } from "@angular/forms";

export interface IProduct {
  Name: string,
  Price: number
}

export interface IProductForm {
  Name: FormControl<string>,
  Price: FormControl<number | null>;
}
