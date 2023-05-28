import { FormControl } from "@angular/forms";

import { IProduct } from "@Interfaces/product.interface";

export interface ISweet {
  ID: number;
  Image: string | null;
  Name: string;
  Products: ISweetProduct[] | null;
  TotalPrice?: number;
}

export interface ISweetFormAdding {
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  Products: FormControl<IProduct[] | null>;
}

export interface ISweetFormEditing {
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  Products: FormControl<ISweetProduct[] | null>;
}

export interface ISweetProduct {
  ProductID: number;
  Quantity: number;
}
