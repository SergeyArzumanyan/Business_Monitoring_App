import { FormArray, FormControl } from "@angular/forms";

import { ISweetProduct } from "@Core/interfaces";

export interface IOrder {
  Client: string | null;
  ClientID: number | null;
  Sweets: IOrderSweet[] | null;
  Address: string | null;
  DeliveryPrice: number | null;
  TotalPrices: IOrderTotalPrices | null;
  OrderDate: number | null;
}

export interface IAddOrderForm {
  Client: FormControl<string | null>;
  ClientID: FormControl<number | null>;
  Sweets: FormArray;
  Address: FormControl<string | null>;
  DeliveryPrice: FormControl<number | null>;
  TotalPrices: FormControl<IOrderTotalPrices | null>;
  OrderDate: FormControl<number | null>;
}

export interface IOrderSweetQuantityForm {
  ID: FormControl<number | null>;
  Name: FormControl<string | null>;
  Products: FormControl<ISweetProduct[] | null>;
  Quantity: FormControl<number | null>;
}

export interface IOrderSweet {
  ID: number;
  Name: string;
  Products: ISweetProduct[];
  Quantity: number;
  PriceWhenOrdered: number;
}

export interface IOrderTotalPrices {
  OrderTotalPrice: number | null;
  SweetsTotalPrice: number | null;
}
