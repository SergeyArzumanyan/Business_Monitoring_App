import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subject, take, takeUntil } from "rxjs";

import {
  IPrimaryItem,
  ISecondaryItem,
  IFirebaseItemDeletion,
} from "@Core/interfaces";
import {
  RequestsService,
  DeleteService,
  ToastService,
  CalculationService,
  TitleService,
} from "@Core/services";

import { ConfirmationService } from "primeng/api";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-primary-item',
  templateUrl: './primary-item.component.html',
  styleUrls: ['./primary-item.component.scss']
})
export class PrimaryItemComponent implements OnInit, OnDestroy {

  public Configs = Configs;

  public primaryItems: IPrimaryItem[] = [];

  public pending: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private calculationService: CalculationService,
    private titleService: TitleService,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.requestPrimaryItems();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private requestPrimaryItems(): void {
    this.pending = true;
    this.Request.GetItems<IPrimaryItem[]>(Configs.PrimaryItemEndPoint)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (primaryItems: IPrimaryItem[] | null) => {
          this.primaryItems = primaryItems ? this.Request.MakeArrayFromFirebaseResponse(primaryItems) : [];
          this.getPrimaryPartsBasedOnItem(this.primaryItems);
          this.titleService.setTitle(Configs.AppMainTitle, this.translateService.instant('PrimaryItems'))
          this.pending = false;
        },
        error: () => {
          this.pending = false;
          this.toastService.showToast(
            'error',
            this.translateService.instant('Error'),
            this.translateService.instant('FailedToGetItems',
              {key: this.translateService.instant('PrimaryItems')})
          );
        }
      });
  }

  private getPrimaryPartsBasedOnItem(primaryItems: IPrimaryItem[]): void {
    if (primaryItems.length > 0) {
      this.pending = true;
    }
    for (const primaryItem of primaryItems) {
      primaryItem.TotalPrice = primaryItem.Profit!;
      for (const partOfItem of primaryItem.SecondaryItems!) {
        this.Request.GetItemByObjectKey(Configs.SecondaryItemEndPoint, 'ID', partOfItem.ID)
          .pipe(take(1))
          .subscribe({
            next: (secondaryItem: ISecondaryItem[]) => {
              this.pending = false;
              this.calculationService.CalculatePrimaryItemPriceInPrimaryPage(primaryItem, secondaryItem, partOfItem.Quantity);
            },
            error: () => {
              this.pending = false;
              this.toastService.showToast(
                'error',
                this.translateService.instant('Error'),
                this.translateService.instant('FailedToGetItems',
                  {key: this.translateService.instant('SecondaryItems')})
                );
            }
          })
      }
    }
  }

  public deletePrimaryItem(primaryItem: IPrimaryItem): void {
    this.Request.GetItemFirebaseKey(Configs.PrimaryItemEndPoint, 'ID', primaryItem.ID)
      .pipe(take(1))
      .subscribe((action: IFirebaseItemDeletion[]) => {
        this.Deletion.RemoveItemByFirebaseKey(Configs.PrimaryItemEndPoint, action[0].payload.key, 'PrimaryItem');
      });
  }

  public DeleteItemConfirm(primaryItem: IPrimaryItem): void {
    this.confirmationService.confirm({
      message: this.translateService.instant('DeleteItemMessage',
        {key: this.translateService.instant(primaryItem.Name!), id: primaryItem.ID}),
      header: this.translateService.instant('DeleteItem',
        {key: this.translateService.instant('PrimaryItem')}),
      icon: 'pi pi-trash icon-big',
      accept: () => {
        this.deletePrimaryItem(primaryItem);
      },
    });
  }
}
