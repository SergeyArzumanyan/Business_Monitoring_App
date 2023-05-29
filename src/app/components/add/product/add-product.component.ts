import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

import { IProductForm, IProductForSending } from "@Core/interfaces";
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
      if (this.productForm.valid && this.productForm.value.Name && this.productForm.value.Price) {
        let product: IProductForSending = {
          ID: +(new Date()),
          Name: this.productForm.value.Name,
          Price: this.productForm.value.Price
        };
        this.Send.createProduct(product);
        this.productForm.reset();
        this.submitted = false;
      }
  }

}
