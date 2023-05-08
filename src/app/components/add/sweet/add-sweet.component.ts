import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { ISweet, ISweetForm } from "@Interfaces/sweet.interface";
import { IProduct } from "@Interfaces/product.interface";
import { SendingDataService } from "@Services/sending-data.service";
import { RequestsService } from "@Services/requests.service";
import { ToastService } from "@Services/toast.service";

@Component({
  selector: 'app-sweet',
  templateUrl: './add-sweet.component.html',
  styleUrls: ['./add-sweet.component.scss']
})
export class AddSweetComponent implements OnInit {

  public isEditMode: boolean = false;

  public sweet: any = {};
  public sweetActualPrice: number = 0;
  public submitted: boolean = false;

  public products: IProduct[] = [];
  public selectedProducts: any = [];

  public sweetForm: FormGroup<ISweetForm> = new FormGroup<ISweetForm>({
    Name: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
    Image: new FormControl(null, [Validators.required]),
    Products: new FormControl([], [Validators.required]),
    CurrentPrice: new FormControl(null, Validators.required)
  })

  constructor(
    private Request: RequestsService,
    private Send: SendingDataService,
    private toastService: ToastService
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
    this.selectedProducts[index].Quantity = Number(inputElement.value);
    this.selectedProducts[index].ActualPrice = Math.round(this.selectedProducts[index].Quantity * this.selectedProducts[index].Price);
  }

  public calculateSweetPrice(): void {
    let arrSum: number = 0;
    for (let product of this.selectedProducts) {
      if (product.ActualPrice && product.ActualPrice !== 0) {
        arrSum += product.ActualPrice;
      }
      this.sweetActualPrice = arrSum;
      this.sweetForm.controls.CurrentPrice.setValue(this.sweetActualPrice);
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

  public imageClear(sweet: ISweet): void {
    sweet.Image = null
    this.sweetForm.patchValue( sweet );
  }
  private resetProducts(): void {
    this.sweetForm.value.Products = [];
    this.sweetForm.controls.Products.setValue([]);
    this.sweetActualPrice = 0;
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
          if (this.sweetForm.value.Name &&  this.sweetForm.value.Products && this.sweetForm.value.CurrentPrice) {
            let sweet: ISweet = {
              ID: +(new Date()),
              Name: this.sweetForm.value.Name,
              CurrentPrice: this.sweetForm.value.CurrentPrice,
              Products: this.sweetForm.value.Products,
              Image: this.sweetForm.value.Image
            }
            this.Send.createSweet(sweet);
          }
          this.sweetForm.reset();
          this.resetProducts();
          this.submitted = false;
        }
    }, 500);

  };
}
