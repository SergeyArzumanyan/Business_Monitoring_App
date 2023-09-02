import { FormArray, FormControl } from "@angular/forms";

import { IPrimaryItemPart } from "@Core/interfaces";

export interface IOrder {
  Client: string | null;
  ClientID: number | null;
  PrimaryItems: IOrderPrimaryItem[] | null;
  Address: string | null;
  DeliveryPrice: number | null;
  TotalPrices: IOrderTotalPrices | null;
  DateOfPurchase: number | null;
  Profit: number | null;
}

export interface IAddOrderForm {
  Client: FormControl<string | null>;
  ClientID: FormControl<number | null>;
  PrimaryItems: FormArray;
  Address: FormControl<string | null>;
  DeliveryPrice: FormControl<number | null>;
  TotalPrices: FormControl<IOrderTotalPrices | null>;
  DateOfPurchase: FormControl<number | null>;
  Profit: FormControl<number | null>;
}

export interface IOrderPrimaryItemQuantityForm {
  ID: FormControl<number | null>;
  Name: FormControl<string | null>;
  SecondaryItems: FormControl<IPrimaryItemPart[] | null>;
  Quantity: FormControl<number | null>;
  Profit: FormControl<number | null>;
}

export interface IOrderPrimaryItem {
  ID: number;
  Name: string;
  SecondaryItems: IPrimaryItemPart[];
  Quantity: number;
  PriceWhenOrdered: number;
  Profit: number;
}

export interface IOrderTotalPrices {
  OrderTotalPrice: number | null;
  PrimaryItemsTotalPrice: number | null;
}
