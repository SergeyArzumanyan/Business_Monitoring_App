import { Injectable } from '@angular/core';
import { take } from "rxjs";

import {
  ISweet,
  ISweetProduct,
  IProduct,
  IFirebaseItemDeletion,
} from "@Core/interfaces";

import {
  RequestsService,
  DeleteService,
  ToastService,
} from "@Core/services";

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private toastService: ToastService,
  ) {}

  public calcTotalSweetPrice(sweet: ISweet, productsOfSweet: ISweetProduct[], sweetProducts: IProduct[]): void {
    for (const productOfSweet of productsOfSweet) {
      const productQuantity: number = productOfSweet.Quantity;

      this.Request.GetItemByObjectKey('products', 'ID', productOfSweet.ProductID)
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
    if (product.length > 0 && product[0].Price) {
      !sweet.TotalPrice ?
        sweet.TotalPrice = product[0].Price * productQuantity :
        sweet.TotalPrice += product[0].Price * productQuantity;
    } else {
      this.Request.GetItemFirebaseKey('sweets', 'ID', sweet.ID)
        .pipe(take(1))
        .subscribe((action: IFirebaseItemDeletion[]) => {
          this.Deletion.RemoveItemByFirebaseKey('sweets', action[0].payload.key, 'Sweet');
        });
    }
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
    if (product.Price) {
      product.TotalPrice = quantity * product.Price;
    }
  }

  private calculateSweetPrice(sweet: ISweet, productTotalPrice: number): void {
    !sweet.TotalPrice ?
      sweet.TotalPrice = productTotalPrice :
      sweet.TotalPrice += productTotalPrice!;
  }

}
