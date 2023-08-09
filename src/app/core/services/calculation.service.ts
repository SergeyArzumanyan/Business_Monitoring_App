import { Injectable } from '@angular/core';
import { take } from "rxjs";

import {
  ISweet,
  ISweetProduct,
  IProduct,
  IFirebaseItemDeletion,
  IOrder,
  ISweetTotalPrices,
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

  public calcTotalSweetPrice(sweet: ISweet, productsOfSweet: ISweetProduct[]): void {
    for (const productOfSweet of productsOfSweet) {
      const productQuantity: number = productOfSweet.Quantity;

      this.Request.GetItemByObjectKey('products', 'ID', productOfSweet.ID)
        .pipe(take(1))
        .subscribe({
          next: (product: IProduct[]) => {
            this.calculateProductProperties(product[0], productQuantity)
            this.calculateSweetPrice(sweet, product[0].TotalPrice!);
          },
          error: () => {
            this.toastService.showToast('error', 'Error', 'Failed To Do Some Calculations.');
          }
        });
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

  private calculateProductProperties(product: IProduct, quantity: number): void {
    product.Quantity = quantity;
    if (product.Price) {
      product.TotalPrice = quantity * product.Price;
    }
  }

  private calculateSweetPrice(sweet: ISweet, productTotalPrice: number): void {
    !sweet.TotalPrice ?
      sweet.TotalPrice = productTotalPrice + (sweet.Profit ? sweet.Profit : 0) :
      sweet.TotalPrice += productTotalPrice!;
  }

  public getProduct(ID: number) {
    return this.Request.GetItemByObjectKey('products', 'ID', ID).pipe(take(1));
  }

  public async CalculateOrderPrice(Order: Partial<IOrder>) {
    Order.TotalPrices!.OrderTotalPrice = 0;
    Order.TotalPrices!.OrderTotalPrice += Order.DeliveryPrice!;

    for (const Sweet of Order.Sweets!) {
      Order.TotalPrices!.SweetsTotalPrice = 0;

      for (const Product of Sweet.Products) {
        const product = await this.getProduct(Product.ID!).toPromise();
        const productPrice: number = product[0].Price * Product.Quantity;

        Order.TotalPrices!.SweetsTotalPrice += productPrice;

        if (Sweet.Products.indexOf(Product) === Sweet.Products.length - 1) {
          const sweetPrice: number = Order.TotalPrices!.SweetsTotalPrice * Sweet.Quantity;
          Sweet.PriceWhenOrdered = sweetPrice;
          Order.TotalPrices!.OrderTotalPrice += sweetPrice;
        }
      }
    }

    Order.TotalPrices!.SweetsTotalPrice = Order.TotalPrices!.OrderTotalPrice - Order.DeliveryPrice!;

    return Order;
  }

  public async CalculateSweetTotalPrice(ProductsForm: any, SweetTotalPrices: ISweetTotalPrices) {
    SweetTotalPrices.Profit = 0;
    SweetTotalPrices.CurrentTotalPrice = 0;
    SweetTotalPrices.Profit += ProductsForm.Profit;
    SweetTotalPrices.CurrentTotalPrice += SweetTotalPrices.Profit;

    for (const Product of ProductsForm.Products) {
      const product = await this.getProduct(Product.ID!).toPromise();

      const productPrice: number = product[0].Price * Product.Quantity;

      SweetTotalPrices.CurrentTotalPrice += productPrice;
    }
  }
}
