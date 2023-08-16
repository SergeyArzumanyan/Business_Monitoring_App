import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from "rxjs";

import { CalculationService, HistoryService, RequestsService, ToastService } from "@Core/services";

@Component({
  selector: 'app-profit',
  templateUrl: './profit.component.html',
  styleUrls: ['./profit.component.scss']
})
export class ProfitComponent implements OnDestroy {
  public profitItems: any[] = [];
  private profitItemsEndPoint: string = 'orders';

  public pending: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private historyService: HistoryService,
    private toastService: ToastService,
  ) {
    this.getOrdersToCalculateProfit();
  }

  public getOrdersToCalculateProfit(): void {
    this.pending = true;
    this.Request.GetItems(this.profitItemsEndPoint)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.profitItems = res ? this.Request.MakeArrayFromFirebaseResponse(res) : [];

          this.pending = false;
          this.historyService.HistoryItems.next(this.profitItems);

          this.historyService.FilteredHistoryItems.next(
            this.historyService.filterBasedOnPeriod(
              this.historyService.SelectedPeriod.getValue(),
              this.profitItems
            )
          );

          this.historyService.setTotalProfit();
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Get Orders.');
          this.pending = false;
        }
      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
