import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from "rxjs";

import {
  HistoryService,
  RequestsService,
  TitleService,
  ToastService
} from "@Core/services";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

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
    private titleService: TitleService,
    public translateService: TranslateService
  ) {
    this.getOrdersToCalculateProfit();
    this.titleService.setTitle(Configs.AppMainTitle, this.translateService.instant('Profit'));
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

          this.historyService.RefreshHistoryTotals();
        },
        error: () => {
          this.toastService.showToast(
            'error',
            this.translateService.instant('Error'),
            this.translateService.instant('FailedToLoadItemsHistory',
              {key: this.translateService.instant('Profit')})
          );
          this.pending = false;
        }
      });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
