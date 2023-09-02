import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { SendingDataService, TitleService } from "@Core/services";
import { onlyPositiveNumbers } from "@Core/validators";

import { IConsumption, IConsumptionForm } from "@Core/interfaces/";
import { TranslateService } from "@ngx-translate/core";

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

  constructor(
    private Send: SendingDataService,
    private titleService: TitleService,
    public translateService: TranslateService
    ) {
    this.titleService.setTitle(this.translateService.instant('Add'), this.translateService.instant('Consumption'));
  }

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
