import { Component, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from "rxjs";

import { IConsumption } from "@Core/interfaces";
import {
  HistoryService,
  RequestsService,
  ToastService
} from "@Core/services";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-consumptions',
  templateUrl: './consumptions.component.html',
  styleUrls: ['./consumptions.component.scss']
})
export class ConsumptionsComponent implements OnDestroy {
  public consumptions: IConsumption[] = [];
  public pending: boolean = false;

  public unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private historyService: HistoryService,
    private toastService: ToastService,
    public translateService: TranslateService
  ) {
    this.getConsumptions();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.historyService.ResetHistoryParams();
  }

  public getConsumptions(): void {
    this.pending = true;
    this.Request.GetItems<IConsumption>('consumptions')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: IConsumption | null) => {
          this.pending = false;
          this.consumptions = res ? this.Request.MakeArrayFromFirebaseResponse(res) : [];
          this.historyService.HistoryItems.next(this.consumptions);

          this.historyService.FilteredHistoryItems.next(
            this.historyService.filterBasedOnPeriod(
              this.historyService.SelectedPeriod.getValue(),
              this.consumptions
            )
          );

          this.historyService.setTotalConsumptions();
        },
        error: () => {
          this.pending = false;
          this.toastService.showToast(
            'error',
            this.translateService.instant('Error'),
            this.translateService.instant('FailedToLoadItemsHistory',
              {key: this.translateService.instant('Consumptions')})
          );
        }
      })
  }
}
