import { FormArray, FormControl } from "@angular/forms";

export interface ISweet {
  ID: number | null;
  Image: string | null;
  Name: string | null;
  Products: ISweetProduct[] | null;
  Profit: number | null;
  TotalPrice?: number;
}

export interface ISweetFormAdding {
  ID: FormControl<number | null>;
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  Products: FormArray;
  Profit: FormControl<number | null>;
}

export interface ISweetFormEditing {
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  Products: FormControl<ISweetProduct[] | null>;
}

export interface ISweetProduct {
  ID: number | null;
  Name: string | null;
  Quantity: number;
}

export interface ISweetQuantityForm {
  ID: FormControl<number | null>;
  Name: FormControl<string | null>;
  Quantity: FormControl<number | null>;
}

export interface ISweetTotalPrices {
  CurrentTotalPrice: number;
  Profit: number;
}
