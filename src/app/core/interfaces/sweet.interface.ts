import { FormControl } from "@angular/forms";

import { IProduct } from "@Interfaces/product.interface";

export interface ISweet {
  Name: string,
  Image: string,
  Products: IProduct[],
  Price: number
}

export interface ISweetForm {
  Name: FormControl<string>,
  Image: FormControl<string>,
  Products: FormControl<IProduct[]>,
  Price: FormControl<number>,
}

