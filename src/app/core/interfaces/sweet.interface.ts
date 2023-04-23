import { FormControl } from "@angular/forms";

import { IProduct } from "@Interfaces/product.interface";

export interface ISweet {
  Name: string,
  Image: string | null,
  Products: IProduct[] | null,
  CurrentPrice: number | null
}

export interface ISweetForm {
  ID: FormControl<number | null>,
  Name: FormControl<string | null>,
  Image: FormControl<string | null>,
  Products: FormControl<IProduct[] | null>,
  Price: FormControl<number | null>,
}

