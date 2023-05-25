import { FormControl } from "@angular/forms";

import { IProduct } from "@Interfaces/product.interface";

export interface ISweet {
  ID: number;
  Image: string | null;
  Name: string;
  Products: ISweetProduct[] | null;
}

export interface ISweetForm {
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  Products: FormControl<IProduct[] | null>;
}

export interface ISweetProduct {
  ProductID: number;
  Quantity: number;
}
