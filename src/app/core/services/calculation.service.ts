import { Injectable } from '@angular/core';
import { take } from "rxjs";

import {
  IPrimaryItem,
  IPrimaryItemPart,
  IPrimaryItemTotalPrices,
  ISecondaryItem,
  IFirebaseItemDeletion,
  IOrder,
} from "@Core/interfaces";
import {
  RequestsService,
  DeleteService,
  ToastService,
} from "@Core/services";
import { AbstractControl } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Injectable({
  providedIn: 'root'
})
export class CalculationService {

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private toastService: ToastService,
    public translateService: TranslateService
  ) {}

  public CalcPrimaryItemTotalPrice(
    primaryItem: IPrimaryItem,
    primaryItemParts: IPrimaryItemPart[]
  ): void {
    for (const primaryItemPart of primaryItemParts) {
      const primaryItemPartQuantity: number = primaryItemPart.Quantity;

      this.Request.GetItemByObjectKey(Configs.SecondaryItemEndPoint, 'ID', primaryItemPart.ID)
        .pipe(take(1))
        .subscribe({
          next: (primaryItemPartRes: ISecondaryItem[]) => {
            this.CalculatePrimaryItemPartProperties(primaryItemPartRes[0], primaryItemPartQuantity)
            this.CalculatePrimaryItemPrice(primaryItem, primaryItemPartRes[0].TotalPrice!);
          },
          error: () => {
            this.toastService.showToast(
              'error',
              'Error',
              this.translateService.instant('FailedToCalculate')
            );
          }
        });
    }
  }

//      For PrimaryItem Page Calculations
  public CalculatePrimaryItemPriceInPrimaryPage(
    primaryItem: IPrimaryItem,
    primaryItemPart: ISecondaryItem[],
    primaryItemPartQuantity: number
  ): void {
    if (primaryItemPart.length > 0 && primaryItemPart[0].Price) {
      !primaryItem.TotalPrice ?
        primaryItem.TotalPrice = primaryItemPart[0].Price * primaryItemPartQuantity :
        primaryItem.TotalPrice += primaryItemPart[0].Price * primaryItemPartQuantity;
    } else {
      this.Request.GetItemFirebaseKey(Configs.PrimaryItemEndPoint, 'ID', primaryItem.ID)
        .pipe(take(1))
        .subscribe((action: IFirebaseItemDeletion[]) => {
          this.Deletion.RemoveItemByFirebaseKey(
            Configs.PrimaryItemEndPoint,
            action[0].payload.key,
            'PrimaryItem'
          );
        });
    }
  }

  private CalculatePrimaryItemPartProperties(
    secondaryItem: ISecondaryItem,
    quantity: number
  ): void {
    secondaryItem.Quantity = quantity;
    if (secondaryItem.Price) {
      secondaryItem.TotalPrice = quantity * secondaryItem.Price;
    }
  }

  private CalculatePrimaryItemPrice(
    primaryItem: IPrimaryItem,
    secondaryItemTotalPrice: number
  ): void {
    !primaryItem.TotalPrice ?
      primaryItem.TotalPrice = secondaryItemTotalPrice + (primaryItem.Profit ? primaryItem.Profit : 0) :
      primaryItem.TotalPrice += secondaryItemTotalPrice!;
  }

  public getSecondaryItemByID(ID: number) {
    return this.Request.GetItemByObjectKey(Configs.SecondaryItemEndPoint, 'ID', ID).pipe(take(1));
  }

  public async CalculateOrderPrice(
    Order: Partial<IOrder>,
    OrderProfit: AbstractControl
  ): Promise<Partial<IOrder>> {
    Order.TotalPrices!.OrderTotalPrice = 0;
    OrderProfit.setValue(0);

    let orderProfit: number = 0;

    for (const primaryItem of Order.PrimaryItems!) {
      Order.TotalPrices!.PrimaryItemsTotalPrice = primaryItem.Profit;
      orderProfit ?
        orderProfit += primaryItem.Profit * primaryItem.Quantity :
        orderProfit = primaryItem.Profit * primaryItem.Quantity;

      for (const secondaryItem of primaryItem.SecondaryItems) {
        const secondaryItemRes = await this.getSecondaryItemByID(secondaryItem.ID!).toPromise();
        const primaryItemPartPrice: number = secondaryItemRes[0].Price * secondaryItem.Quantity;

        Order.TotalPrices!.PrimaryItemsTotalPrice += primaryItemPartPrice;

        if (primaryItem.SecondaryItems.indexOf(secondaryItem) === primaryItem.SecondaryItems.length - 1) {
          const primaryItemPrice: number = Order.TotalPrices!.PrimaryItemsTotalPrice * primaryItem.Quantity;
          OrderProfit.setValue(orderProfit);
          primaryItem.PriceWhenOrdered = primaryItemPrice;
          Order.TotalPrices!.OrderTotalPrice += primaryItemPrice;
        }
      }
    }

    Order.TotalPrices!.PrimaryItemsTotalPrice = Order.TotalPrices!.OrderTotalPrice;

    return Order;
  }

  public async CalculatePrimaryItemTotalPrice(
    SecondaryItemForm: any,
    PrimaryItemTotalPrices: IPrimaryItemTotalPrices
  ): Promise<void> {
    PrimaryItemTotalPrices.Profit = 0;
    PrimaryItemTotalPrices.CurrentTotalPrice = 0;
    PrimaryItemTotalPrices.Profit += SecondaryItemForm.Profit;
    PrimaryItemTotalPrices.CurrentTotalPrice += PrimaryItemTotalPrices.Profit;

    for (const secondaryItem of SecondaryItemForm.SecondaryItems) {
      const secondaryItemRes = await this.getSecondaryItemByID(secondaryItem.ID!).toPromise();

      const secondaryItemPrice: number = secondaryItemRes[0].Price * secondaryItem.Quantity;

      PrimaryItemTotalPrices.CurrentTotalPrice += secondaryItemPrice;
    }
  }

  public CalculateTotal(items: any[], totalKey: string, subTotalKey?: string): number {
    if (items.length === 0) {
      return 0;
    }

    let total: number =  0;

    for (const item of items) {
      if (!subTotalKey) {
        total += item[totalKey];
      } else {
        total += item[totalKey][subTotalKey];
      }
    }

    return total;
  }
}
