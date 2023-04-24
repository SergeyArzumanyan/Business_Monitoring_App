import { FormControl } from "@angular/forms";

import { IProduct } from "@Interfaces/product.interface";

export interface ISweet {
  CurrentPrice: number | null;
  Image: string | null;
  Name: string;
  Products: IProduct[] | null;
}

export interface ISweetForm {
  ID: FormControl<number | null>;
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  Price: FormControl<number | null>;
  Products: FormControl<IProduct[] | null>;
}

