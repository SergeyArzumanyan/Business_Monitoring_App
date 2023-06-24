import { Injectable } from '@angular/core';
import { take } from "rxjs";

import {
  ISweet,
  ISweetProduct,
  IProduct,
} from "@Core/interfaces";

import {
  RequestsService,
  ToastService,
} from "@Core/services";

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor(
    private Request: RequestsService,
    private toastService: ToastService,
  ) {}

  public calcTotalSweetPrice(sweet: ISweet, productsOfSweet: ISweetProduct[], sweetProducts: IProduct[]): void {
    for (const productOfSweet of productsOfSweet) {
      const productQuantity: number = productOfSweet.Quantity;

      this.Request.getProductsBasedOnSweet(productOfSweet.ProductID)
        .pipe(take(1))
        .subscribe({
          next: (product: IProduct[]) => {
            this.calculateProductProperties(product[0], productQuantity)
            sweetProducts.push(product[0]);

            this.calculateSweetPrice(sweet, product[0].TotalPrice!);
          },
          error: () => {
            this.toastService.showToast('error', 'Error', 'Something went wrong.');
          }
        })
    }
  }

//      For Sweets Page Calculations
  public calculateSweetPriceInSweets(sweet: ISweet, product: IProduct[], productQuantity: number): void {
    !sweet.TotalPrice ?
      sweet.TotalPrice = product[0].Price * productQuantity :
      sweet.TotalPrice += product[0].Price * productQuantity;
  }

  //    For Sweet Inner Page Calculation
  public calculateSweetPriceAfterEdit(sweet: ISweet, sweetProducts: IProduct[] | null): void {
    sweet.TotalPrice = 0;
    for (const product of sweetProducts!) {
      !sweet.TotalPrice ?
        sweet.TotalPrice = product.TotalPrice :
        sweet.TotalPrice += product.TotalPrice!;
    }
  }

  private calculateProductProperties(product: IProduct, quantity: number): void {
    product.Quantity = quantity;
    product.TotalPrice = quantity * product.Price;
  }

  private calculateSweetPrice(sweet: ISweet, productTotalPrice: number): void {
    !sweet.TotalPrice ?
      sweet.TotalPrice = productTotalPrice :
      sweet.TotalPrice += productTotalPrice!;
  }

}
