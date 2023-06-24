import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

import {
  ISweet,
  IProduct,
  ISweetProduct,
  ISweetFormAdding
} from "@Core/interfaces";
import {
  SendingDataService,
  RequestsService,
  ToastService
} from "@Core/services";

@Component({
  selector: 'app-sweet',
  templateUrl: './add-sweet.component.html',
  styleUrls: ['./add-sweet.component.scss']
})
export class AddSweetComponent implements OnInit {

  public isEditMode: boolean = false;

  public sweet: any = {};
  public sweetTotalPrice: number = 0;
  public submitted: boolean = false;

  public products: IProduct[] = [];
  public selectedProducts: any = [];

  public sweetForm: FormGroup<ISweetFormAdding> = new FormGroup<ISweetFormAdding>({
    Name: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    Image: new FormControl(null, [Validators.required]),
    Products: new FormControl([], [Validators.required]),
  })

  constructor(
    private Request: RequestsService,
    private Send: SendingDataService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.requestProducts();
  }

  private requestProducts(): void {
    this.Request.getProducts()
      .subscribe({
        next: (products: IProduct[] | null) => {
          this.products = products ? this.Request.makeArray(products) : [];
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Something Went Wrong');
        }
      });
  }

  public onInputType(inputElement: any, index: number): void {
    if (inputElement.value === '' && !inputElement.value) {
      inputElement.value = ' ';
    }
    this.selectedProducts[index].Quantity = Number(inputElement.value);
    this.selectedProducts[index].TotalPrice = Math.round(this.selectedProducts[index].Quantity * this.selectedProducts[index].Price);
  }

  public calculateSweetPrice(): void {
    let arrSum: number = 0;
    for (const product of this.selectedProducts) {
      if (product.TotalPrice && product.TotalPrice !== 0) {
        arrSum += product.TotalPrice;
      }
      this.sweetTotalPrice = arrSum;
      // this.sweetForm.controls.CurrentPrice.setValue(this.sweetTotalPrice);
    }
  }

  public onFileChange( event: any ) {
    const reader = new FileReader();

    if ( event.target.files && event.target.files.length ) {
      const [ file ] = event.target.files;
      reader.readAsDataURL( file );

      reader.onload = () => {
        this.sweetForm.controls.Image.setValue( reader.result as string );
      };

    }
  }
  public imageDropped( Image: any ): void {
    this.sweetForm.controls.Image.setValue( Image );
  }

  public imageClear(sweet: any): void {
    sweet.Image = null
    this.sweetForm.patchValue( sweet );
  }
  private resetProducts(): void {
    this.sweetForm.value.Products = [];
    this.sweetForm.controls.Products.setValue([]);
    this.sweetTotalPrice = 0;
  }

  private generateProductsForSweet(selectedProducts: IProduct[]): ISweetProduct[] {
    const productsToSend: ISweetProduct[] = [];

    if (selectedProducts) {
      for (const product of selectedProducts) {
        const transformedProduct: ISweetProduct = {
          ProductID: product.ID,
          Quantity: product.Quantity
        }

        productsToSend.push(transformedProduct);
      }
    }

    return productsToSend;
  }

  public addSweet(): void {

    setTimeout(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
      this.sweetForm.value.Image = this.sweetForm.controls.Image.value;
      this.submitted = true;

      if (this.sweetForm.valid) {
          if (this.sweetForm.value.Name &&  this.sweetForm.value.Products) {
            const sweet: ISweet = {
              ID: +(new Date()),
              Name: this.sweetForm.value.Name,
              Products: this.generateProductsForSweet(this.sweetForm.value.Products),
              Image: this.sweetForm.value.Image
            }
            this.Send.createSweet(sweet);
          }
          this.sweetForm.reset();
          this.resetProducts();
          this.submitted = false;
        }
    }, 500);

  }
}
