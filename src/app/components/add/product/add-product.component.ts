import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IProduct, IProductForm } from "@Interfaces/product.interface";
import { SendingDataService } from "@Services/sending-data.service";

@Component({
  selector: 'app-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {

  public submitted: boolean = false;

  public productForm: FormGroup<IProductForm> = new FormGroup<any>({
    Name: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(2)
    ]),
    Price: new FormControl<number | null>(null, [
      Validators.required
    ])
  })


  constructor(private Send: SendingDataService) {}

  public addProduct(): void {
    setTimeout(() => {
        this.submitted = true;
        if (this.productForm.valid && this.productForm.value.Name && this.productForm.value.Price) {
          let product: IProduct = {
            Name: this.productForm.value.Name,
            Price: this.productForm.value.Price
          };
          this.Send.saveProduct(product);
          console.log(this.productForm.value); // Object that You need to send to firebase Sergo, add product to firebase.
          this.productForm.reset();
          this.submitted = false;
        }
    }, 500);
  }

}
