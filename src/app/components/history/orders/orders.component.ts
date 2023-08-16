import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from "rxjs";

import {
  HistoryService,
  RequestsService,
  ToastService
} from "@Core/services";
import { IOrder } from "@Core/interfaces";

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

          this.pending = false;
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Load Orders History');
          this.pending = false;
        }
      });
  }

}
