import { FormControl } from "@angular/forms";

import { IProduct } from "@Interfaces/product.interface";

export interface ISweet {
  ID: number | null;
  CurrentPrice: number | null;
  Image: string | null;
  Name: string;
  Products: IProduct[] | null;
}

export interface ISweetForm {
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  CurrentPrice: FormControl<number | null>;
  Products: FormControl<IProduct[] | null>;
}

