import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil } from "rxjs";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";

import {
  RequestsService,
  ToastService,
  HistoryService,
} from "@Core/services";
import {
  IPeriod,
  IClient,
  IOrder,
} from "@Core/interfaces";

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent implements OnInit, OnDestroy {

  @Input() HistoryItemName: string = 'Order';
  @Input() Pending: boolean = false;

  public clients: IClient[] = []
  public RouteClientID: number | null = null;

  public selectedClient: IClient[] = [];
  public selectedPeriod: IPeriod[] = [];

  public unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    public historyService: HistoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.CheckForClientID();
    this.CheckForOrdersPage();
    this.CheckForConsumptionsPage();
    this.CheckForProfitPage();

    this.selectedPeriod = [this.historyService.HistoryPeriods[0]];
  }

  ngOnInit(): void {
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(
        filter((event): boolean => event instanceof NavigationStart),
      ).subscribe({
      next: () => {
        this.selectedPeriod = [];
        this.historyService.ResetHistoryParams();
      }
    });
  }

  private CheckForOrdersPage(): void {
    if (this.router.url.includes('orders')) {
      this.historyService.IsInOrdersPage.next(true);
      this.getClients();
    }
  }

  private CheckForConsumptionsPage(): void {
    if (this.router.url.includes('consumptions')) {
      this.historyService.IsInConsumptionsPage.next(true);
    }
  }

  private CheckForProfitPage(): void {
    if (this.router.url.includes('profit')) {
      this.historyService.IsInProfitPage.next(true);
    }
  }

  private CheckForClientID(): void {
    this.historyService.SelectedClientID.next(this.route.snapshot.params['client-id']);
    this.RouteClientID = this.route.snapshot.params['client-id'];

    if (
      this.RouteClientID ||
      this.historyService.SelectedClientID.getValue()
    ) {
      this.GetOrdersHistoryForClient();
    }
  }

  private getClients(): void {
    this.Request.GetItems<IClient[]>('clients')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: IClient[] | null) => {
          this.clients = res ? this.Request.MakeArrayFromFirebaseResponse(res) : [];
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Get Clients.');
        }
      });
  }

  private GetOrdersHistoryForClient(): void {
    this.Request.GetItems<IOrder[]>('orders')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: IOrder[] | null) => {

          this.historyService.HistoryItems.next(
            res ? this.Request.MakeArrayFromFirebaseResponse(res) : []
          );
          this.historyService.FilteredHistoryItems.next(
              this.historyService.filterBasedOnPeriod(
                this.historyService.SelectedPeriod.getValue(),
                this.historyService.HistoryItems.getValue(),
                this.historyService.SelectedClientID.getValue()
              )
          );

          this.Pending = false;
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Load Orders History');
          this.Pending = false;
        }
      });
  }

  public setPeriod(e: any): void {
    this.selectedPeriod = e.value.length ? [e.value[e.value.length - 1]] : [];

    this.historyService.SelectedPeriod.next(
      this.selectedPeriod[0]?.Name ? this.selectedPeriod[0].Name : 'Today'
    );

    this.historyService.RefreshHistoryItems();
    if (!e.value[0]) {
      this.historyService.FilteredHistoryItems.next([]);
      this.historyService.HistoryItemsTotalProfit.next(0);
      this.historyService.HistoryItemsTotalConsumptions.next(0);
    }
  }

  public setClient(e: any): void {
    this.selectedClient = e.value.length ? [e.value[e.value.length - 1]] : [];

    this.historyService.SelectedClientID.next(
      this.selectedClient[0]?.ID ? this.selectedClient[0].ID : null
    );

    this.historyService.RefreshHistoryItems();
  }
}
