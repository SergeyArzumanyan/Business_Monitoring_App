import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from "rxjs";

import {
  HistoryService,
  RequestsService,
  ToastService
} from "@Core/services";
import { IOrder } from "@Core/interfaces";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnDestroy {

  public orders: IOrder[] = [];

  public pending: boolean = false;

  public unsubscribe$: Subject<void> =new Subject<void>();

  constructor(
    private Request: RequestsService,
    private historyService: HistoryService,
    private toastService: ToastService,
    public translateService: TranslateService
  ) {
    this.getAllOrders();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.historyService.ResetHistoryParams();
  }

  private getAllOrders(): void {
    this.pending = true;
    this.Request.GetItems<IOrder[]>('orders')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: IOrder[] | null) => {
          this.orders = res ? this.Request.MakeArrayFromFirebaseResponse(res) : [];

          this.historyService.HistoryItems.next(this.orders);

          this.historyService.FilteredHistoryItems.next(
            this.historyService.filterBasedOnPeriod(
              this.historyService.SelectedPeriod.getValue(),
              this.orders
              )
          );

          this.historyService.RefreshHistoryTotals();

          this.pending = false;
        },
        error: () => {
          this.toastService.showToast(
            'error',
            this.translateService.instant('Error'),
            this.translateService.instant('FailedToLoadItemsHistory',
              {key: this.translateService.instant('Orders')})
          );
          this.pending = false;
        }
      });
  }

}
