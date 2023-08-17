import { Injectable } from '@angular/core';

import { IPeriod } from "@Core/interfaces";
import { BehaviorSubject } from "rxjs";
import { CalculationService } from "@Core/services/calculation.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class HistoryService {

  public HistoryItems: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public FilteredHistoryItems: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  public HistoryItemsTotalProfit: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public HistoryItemsTotalConsumptions: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public SelectedPeriod: BehaviorSubject<string> = new BehaviorSubject<string>(this.translateService.instant('Today'));

  public SelectedClientID: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  public HistoryPeriods: IPeriod[] = [
    {
      Name: this.translateService.instant('Today'),
    },
    {
      Name: this.translateService.instant('Yesterday'),
    },
    {
      Name: this.translateService.instant('ThisWeek'),
    },
    {
      Name: this.translateService.instant('ThisMonth'),
    },
    {
      Name: this.translateService.instant('Last3Months'),
    },
    {
      Name: this.translateService.instant('Last6Months'),
    },
    {
      Name: this.translateService.instant('ThisYear'),
    }
  ];

  public IsInOrdersPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public IsInConsumptionsPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public IsInProfitPage: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    public translateService: TranslateService,
    private calculationsService: CalculationService
  ) {
  }

  public ResetHistoryParams(): void {
    this.HistoryItems.next([]);
    this.FilteredHistoryItems.next([]);

    this.SelectedPeriod.next(this.translateService.instant('Today'));
    this.SelectedClientID.next(null);

    this.IsInOrdersPage.next(false);
    this.IsInConsumptionsPage.next(false);
    this.IsInProfitPage.next(false);

    this.HistoryItemsTotalProfit.next(0);
    this.HistoryItemsTotalConsumptions.next(0);
  }

  private filterForToday(historyItems: any[]): any[] {
    const today: Date = new Date();
    today.setHours(0, 0, 0, 0);

    return historyItems
      .filter(historyItem => {
        const historyItemDate = new Date(historyItem.DateOfPurchase!);
        return historyItemDate >= today && historyItemDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      })
      .sort((a, b) => b.DateOfPurchase! - a.DateOfPurchase!);
  }

  private filterForYesterday(historyItems: any[]): any[] {
    const yesterday: Date = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    return historyItems
      .filter(historyItem => {
        const historyItemDate = new Date(historyItem.DateOfPurchase!);
        return historyItemDate >= yesterday && historyItemDate < new Date(yesterday.getTime() + 24 * 60 * 60 * 1000);
      })
      .sort((a, b) => a.DateOfPurchase! - b.DateOfPurchase!);
  }

  private filterForOneWeek(historyItems: any[]): any[] {
    const oneWeekAgo: Date = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return historyItems
      .filter(historyItem => new Date(historyItem.DateOfPurchase!) >= oneWeekAgo)
      .sort((a, b) => b.DateOfPurchase! - a.DateOfPurchase!);
  }

  private filterForOneMonth(historyItems: any[]): any[] {
    const oneMonthAgo: Date = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return historyItems
      .filter(historyItem => new Date(historyItem.DateOfPurchase!) >= oneMonthAgo)
      .sort((a, b) => b.DateOfPurchase! - a.DateOfPurchase!);
  }

  private filterForThreeMonths(historyItems: any[]): any[] {
    const threeMonthsAgo: Date = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    return historyItems
      .filter(historyItem => new Date(historyItem.DateOfPurchase!) >= threeMonthsAgo)
      .sort((a, b) => b.DateOfPurchase! - a.DateOfPurchase!);
  }

  private filterForSixMonths(historyItems: any[]): any[] {
    const sixMonthsAgo: Date = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return historyItems
      .filter(historyItem => new Date(historyItem.DateOfPurchase!) >= sixMonthsAgo)
      .sort((a, b) => b.DateOfPurchase! - a.DateOfPurchase!);
  }

  private filterForOneYear(historyItems: any[]): any[] {
    const oneYearAgo: Date = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return historyItems
      .filter(historyItem => new Date(historyItem.DateOfPurchase!) >= oneYearAgo)
      .sort((a, b) => b.DateOfPurchase! - a.DateOfPurchase!);
  }

  public filterBasedOnPeriod(selectedPeriod: string, historyItems: any[], clientId?: number | null): any[] {
    switch (selectedPeriod) {
      case this.translateService.instant('Today'):
        return clientId ? this.filterForClient(clientId, this.filterForToday(historyItems)) : this.filterForToday(historyItems);
      case this.translateService.instant('Yesterday'):
        return clientId ? this.filterForClient(clientId, this.filterForYesterday(historyItems)) : this.filterForYesterday(historyItems);
      case this.translateService.instant('ThisWeek'):
        return clientId ? this.filterForClient(clientId, this.filterForOneWeek(historyItems)) : this.filterForOneWeek(historyItems);
      case this.translateService.instant('ThisMonth'):
        return clientId ? this.filterForClient(clientId, this.filterForOneMonth(historyItems)) : this.filterForOneMonth(historyItems);
      case this.translateService.instant('Last3Months'):
        return clientId ? this.filterForClient(clientId, this.filterForThreeMonths(historyItems)) : this.filterForThreeMonths(historyItems);
      case this.translateService.instant('Last6Months'):
        return clientId ? this.filterForClient(clientId, this.filterForSixMonths(historyItems)) : this.filterForSixMonths(historyItems);
      case this.translateService.instant('ThisYear'):
        return clientId ? this.filterForClient(clientId, this.filterForOneYear(historyItems)) : this.filterForOneYear(historyItems);
      default:
        return clientId ? this.filterForClient(clientId, this.filterForToday(historyItems)) : this.filterForToday(historyItems);
    }
  }

  public filterForClient(clientId: number, historyItems: any[]): any[] {
    return historyItems.filter(historyItem => Number(historyItem.ClientID) === Number(clientId));
  }

  public setTotalProfit(): void {
    this.HistoryItemsTotalProfit.next(
      this.calculationsService
        .CalculateOrdersTotalProfit(this.FilteredHistoryItems.getValue())
    );
  }

  public setTotalConsumptions(): void {
    this.HistoryItemsTotalConsumptions.next(
      this.calculationsService
        .CalculateOrdersTotalConsumptions(this.FilteredHistoryItems.getValue())
    );
  }

  public RefreshHistoryItems(): void {
    this.FilteredHistoryItems.next(this.filterBasedOnPeriod(
      this.SelectedPeriod.getValue(),
      this.HistoryItems.getValue(),
      this.SelectedClientID.getValue()
    ));

    if (this.IsInProfitPage.getValue()) {
      this.setTotalProfit();
    } else if (this.IsInConsumptionsPage.getValue()) {
      this.setTotalConsumptions();
    }
  }
}
