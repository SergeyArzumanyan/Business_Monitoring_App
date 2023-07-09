import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { IProduct, IProductForm } from "@Core/interfaces";
import { SendingDataService } from "@Core/services";
import { onlyPositiveNumbers } from "@Core/validators";

@Component({
  selector: 'app-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  public submitted: boolean = false;

  public productForm: FormGroup<IProductForm> = new FormGroup<IProductForm>({
    ID: new FormControl<number | null>(null),
    Name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2)
    ]),
    Price: new FormControl<number | null>(null, [
      Validators.required,
      Validators.max(500000),
      onlyPositiveNumbers()
    ]),
  });


  constructor(private Send: SendingDataService) {}

  public addProduct(): void {
      this.submitted = true;
      if (this.productForm.valid) {
        this.productForm.controls.ID.setValue(+(new Date()));
        this.Send.CreateItem<IProduct>('products', 'Product', this.productForm.value);
        this.productForm.reset();
        this.submitted = false;
      }
  }

}
