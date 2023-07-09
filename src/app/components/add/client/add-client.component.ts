import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IClient, IClientForm } from "@Core/interfaces";
import { onlyWhiteSpaceValidator } from "@Core/validators";
import { SendingDataService } from "@Core/services";

@Component({
  selector: 'app-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent {

  public clientForm: FormGroup<IClientForm> = new FormGroup<IClientForm>({
    ID: new FormControl<number | null>(null),
    Name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20),
      onlyWhiteSpaceValidator()
    ]),
    Surname: new FormControl<string | null>(null, [
      Validators.minLength(2),
      Validators.maxLength(20),
      onlyWhiteSpaceValidator()
    ]),
    PhoneNumber: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    Address: new FormControl<string | null>(null,[
      Validators.required,
      onlyWhiteSpaceValidator(),
      Validators.maxLength(25)
    ]),
    Orders: new FormControl<null>(null)
  });

  public submitted: boolean = false;

  constructor(private Send: SendingDataService) {}

  public addClient(): void {
    this.submitted = true;
    if (this.clientForm.valid) {
      this.clientForm.controls.ID.setValue(+(new Date()));
      this.Send.CreateItem<IClient>('clients', 'Client', this.clientForm.value);
      this.clientForm.reset();
      this.submitted = false;
    }
  }

}
