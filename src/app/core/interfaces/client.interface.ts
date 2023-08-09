import { FormControl } from "@angular/forms";

import { IOrder } from "@Core/interfaces";

export interface IClient {
  ID: number | null;
  Name: string | null;
  Surname?: string | null;
  PhoneNumber: string | null;
  UsualAddress: string | null;
  Orders: IClientOrders | null;
}

export interface IClientForm {
  ID: FormControl<number | null>;
  Name: FormControl<string | null>;
  Surname?: FormControl<string | null>;
  PhoneNumber: FormControl<string | null>;
  UsualAddress: FormControl<string | null>;
  Orders?: FormControl<IClientOrders | null>;
}

export interface IClientOrders {
  Entities: Partial<IOrder>[] | null;
  Count: number | null;
}
