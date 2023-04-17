import { FormControl } from "@angular/forms";

import { IProduct } from "@Interfaces/product.interface";

export interface ISweet {
  Name: string,
  Image: string | null,
  Products: IProduct[],
  Price: number | null
}

export interface ISweetForm {
  Name: FormControl<string | null>,
  Image: FormControl<string | null>,
  Products: FormControl<IProduct[] | null>,
  Price: FormControl<number | null>,
}

