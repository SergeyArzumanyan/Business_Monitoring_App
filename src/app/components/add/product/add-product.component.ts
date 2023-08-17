import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { IProduct, IProductForm } from "@Core/interfaces";
import { SendingDataService } from "@Core/services";
import { onlyPositiveNumbers } from "@Core/validators";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  public addProductForm: FormGroup<IProductForm> = new FormGroup<IProductForm>({
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
    public translateService: TranslateService
    ) {}

  public onAdd(): void {
      if (this.addProductForm.valid) {
        this.addProductForm.controls.ID.setValue(+(new Date()));
        this.Send.CreateItem<IProduct>('products', 'Product', this.addProductForm.value);
        this.addProductForm.reset();
      } else {
        this.addProductForm.markAllAsTouched();
      }
  }

}
