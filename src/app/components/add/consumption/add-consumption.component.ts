import { Component } from '@angular/core';
import { IConsumption, IConsumptionForm } from "@Core/interfaces/consumption.interface";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IProduct } from "@Core/interfaces";
import { SendingDataService } from "@Core/services";
import { onlyPositiveNumbers } from "@Core/validators";

@Component({
  selector: 'app-add-consumption',
  templateUrl: './add-consumption.component.html',
  styleUrls: ['./add-consumption.component.scss']
})
export class AddConsumptionComponent {

  public addConsumptionForm: FormGroup<IConsumptionForm> = new FormGroup<IConsumptionForm>({
    ID: new FormControl(null),
    DateOfPurchase: new FormControl(null),
    Name: new FormControl(null, [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2)
    ]),
    Price: new FormControl(null, [
      Validators.required,
      Validators.max(500000),
      onlyPositiveNumbers()
    ])
  });

  constructor(private Send: SendingDataService) {}

  public onAdd(): void {
    if (this.addConsumptionForm.valid) {
      this.addConsumptionForm.controls.ID.setValue(+(new Date()));
      this.addConsumptionForm.controls.DateOfPurchase.setValue(+(new Date()));
      this.Send.CreateItem<IConsumption>('consumptions', 'Consumption', this.addConsumptionForm.value);
      this.addConsumptionForm.reset();
    } else {
      this.addConsumptionForm.markAllAsTouched();
    }
  }
}
