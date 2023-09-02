import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { ISecondaryItem, ISecondaryItemForm } from "@Core/interfaces";
import { SendingDataService, TitleService } from "@Core/services";
import { onlyPositiveNumbers } from "@Core/validators";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-add-secondary-item',
  templateUrl: './add-secondary-item.component.html',
  styleUrls: ['./add-secondary-item.component.scss']
})
export class AddSecondaryItemComponent {

  public addProductForm: FormGroup<ISecondaryItemForm> = new FormGroup<ISecondaryItemForm>({
    ID: new FormControl(null),
    Name: new FormControl(null, [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2)
    ]),
    Price: new FormControl(null, [
      Validators.required,
      Validators.max(500000),
      onlyPositiveNumbers()
    ]),
  });


  constructor(
    private Send: SendingDataService,
    private titleService: TitleService,
    public translateService: TranslateService
    ) {
    this.titleService.setTitle(this.translateService.instant('Add'), this.translateService.instant('SecondaryItem'));
  }

  public onAdd(): void {
      if (this.addProductForm.valid) {
        this.addProductForm.controls.ID.setValue(+(new Date()));
        this.Send.CreateItem<ISecondaryItem>(
          Configs.SecondaryItemEndPoint,
          'SecondaryItem',
          this.addProductForm.value
        );
        this.addProductForm.reset();
      } else {
        this.addProductForm.markAllAsTouched();
      }
  }

}
