import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IProductForm, IProductForSending } from "@Interfaces/product.interface";
import { SendingDataService } from "@Services/sending-data.service";
import { onlyPositiveNumbers } from "@Validators/only-positive-numbers.validator";

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
      onlyPositiveNumbers()
    ]),
  });


  constructor(private Send: SendingDataService) {}

  public addProduct(): void {
    setTimeout(() => {
        this.submitted = true;
        if (this.productForm.valid && this.productForm.value.Name && this.productForm.value.Price) {
          let product: IProductForSending = {
            Name: this.productForm.value.Name,
            Price: this.productForm.value.Price,
            ActualPrice: 0,
            Quantity: 0
          };
          this.Send.createProduct(product);
          this.productForm.reset();
          this.submitted = false;
        }
    }, 500);
  }

}
