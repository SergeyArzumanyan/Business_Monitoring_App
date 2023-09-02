import { FormArray, FormControl } from "@angular/forms";

export interface IPrimaryItem {
  ID: number | null;
  Image: string | null;
  Name: string | null;
  SecondaryItems: IPrimaryItemPart[] | null;
  Profit: number | null;
  TotalPrice?: number;
}

export interface IPrimaryItemFormAdding {
  ID: FormControl<number | null>;
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  SecondaryItems: FormArray;
  Profit: FormControl<number | null>;
}

export interface IPrimaryItemFormEditing {
  Image: FormControl<string | null>;
  Name: FormControl<string | null>;
  Products: FormControl<IPrimaryItemPart[] | null>;
}

export interface IPrimaryItemPart {
  ID: number | null;
  Name: string | null;
  Quantity: number;
}

export interface IPrimaryItemQuantityForm {
  ID: FormControl<number | null>;
  Name: FormControl<string | null>;
  Quantity: FormControl<number | null>;
}

export interface IPrimaryItemTotalPrices {
  CurrentTotalPrice: number;
  Profit: number;
}
