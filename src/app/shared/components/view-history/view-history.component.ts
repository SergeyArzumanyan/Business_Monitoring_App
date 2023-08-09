import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, Subject, takeUntil } from "rxjs";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";

import {
  RequestsService,
  ToastService,
  HistoryService,
} from "@Core/services";
import {
  IPeriod,
  IOrder, IClient,
} from "@Core/interfaces";

@Component({
  selector: 'app-view-history',
  templateUrl: './view-history.component.html',
  styleUrls: ['./view-history.component.scss']
})
export class ViewHistoryComponent implements OnInit, OnDestroy {

  public periods: IPeriod[] = [];
  public selectedPeriod: IPeriod[] = [];

  public clientId?: number;

  public clients: IClient[] = []
  public selectedClient: IClient[] = [];

  public orders: IOrder[] = [];

  public pending: boolean = false;

  public unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private historyService: HistoryService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.periods = this.historyService.IHistoryPeriods;
    this.selectedPeriod = [this.periods[0]];
    this.getClients();
    this.getOrdersHistory();
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
      }
    });
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

  public setPeriod(e: any): void {
    this.selectedPeriod = e.value.length ? [e.value[e.value.length - 1]] : [];
    this.getOrdersHistory();
  }

  public setClient(e: any): void {
    this.selectedClient = e.value.length ? [e.value[e.value.length - 1]] : [];
    this.getOrdersHistory();
  }

  private getOrdersHistory(): void {
    this.pending = true;
    this.clientId = this.route.snapshot.params['client-id'];
    if (this.clientId || this.selectedClient[0]?.ID) {
      this.Request.GetItems<IOrder[]>('orders')
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res: IOrder[] | null) => {
            this.orders = res && this.selectedPeriod[0]?.Name ?
              this.historyService.filterBasedOnPeriod(
                this.selectedPeriod[0].Name,
                this.Request.MakeArrayFromFirebaseResponse(res),
                this.clientId || this.selectedClient[0].ID,
              )
              : [];
            this.pending = false;
          },
          error: () => {
            this.toastService.showToast('error', 'Error', 'Failed To Load Orders History');
            this.pending = false;
          }
        });
    } else {
      this.Request.GetItems<IOrder[]>('orders')
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (res: IOrder[] | null) => {
            this.orders = res && this.selectedPeriod[0]?.Name ?
              this.historyService.filterBasedOnPeriod(
                this.selectedPeriod[0].Name,
                this.Request.MakeArrayFromFirebaseResponse(res)
              )
              : [];
            this.pending = false;
          },
          error: () => {
            this.toastService.showToast('error', 'Error', 'Failed To Load Orders History');
            this.pending = false;
          }
        });
    }
  }
}
