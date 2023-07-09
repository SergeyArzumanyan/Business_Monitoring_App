import { FormControl } from "@angular/forms";

export interface IClient {
  ID: number | null;
  Name: string | null;
  Surname?: string | null;
  PhoneNumber: string | null;
  Address: string | null;
  Orders: any[] | null;
}

export interface IClientForm {
  ID: FormControl<number | null>;
  Name: FormControl<string | null>;
  Surname?: FormControl<string | null>;
  PhoneNumber: FormControl<string | null>;
  Address: FormControl<string | null>;
  Orders: FormControl<null>;
}
