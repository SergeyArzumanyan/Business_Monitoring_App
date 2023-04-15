import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IProductForm } from "@Interfaces/product.interface";

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

  public addProduct(): void {
    this.submitted = true;
    if (this.productForm.valid) {
      console.log(this.productForm.value); // Object that You need to send to firebase Sergo, add product to firebase.
      this.productForm.reset();
      this.submitted = false;
    }
  }
}
