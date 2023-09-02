import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { onlyPositiveNumbers, onlyWhiteSpaceValidator } from "@Core/validators";
import {
  ISecondaryItem,
  ISecondaryItemForm,
} from "@Core/interfaces";
import {
  RequestsService,
  TitleService,
  ToastService,
} from "@Core/services";

import {
  IContextMenuItem,
  ITableConfig,
} from "@Shared/components/table/interfaces";
import { ITableFilters } from "app/shared/components/table/filters/interfaces";

import { TableService } from '@Shared/components/table/services'
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-secondary-item',
  templateUrl: './secondary-item.component.html',
  styleUrls: ['./secondary-item.component.scss']
})
export class SecondaryItemComponent implements OnInit, OnDestroy {

  public products: ISecondaryItem[] | null = [];

  public secondaryItemTableConfig: ITableConfig<ISecondaryItem[]> = {
    TableItems: [],
    TableName: 'SecondaryItems',
    ItemName: 'SecondaryItem',
    TableActions: true,
    ItemEndPoint: Configs.SecondaryItemEndPoint
  };

  public secondaryItemTableFilters: ITableFilters = {
    ShowName: true,
    ShowPrice: true
  };

  public secondaryItemTableContextMenuOptions: IContextMenuItem[] = [
    {
      Label: 'Edit',
      IconClass: 'pi pi-pencil',
      Action: (Item: ISecondaryItem): void =>  {
        this.TableService.EditDialogForm.next(this.secondaryItemForm);
        this.TableService.EnableTableRowEdit(Item);
      }
    },
    {
      Label: 'Delete',
      IconClass: 'pi pi-trash',
      Action: (Item: ISecondaryItem): void => {
        this.TableService.EditDialogForm.next(this.secondaryItemForm);
        this.TableService.DeleteItem(this.secondaryItemTableConfig, Item)
      }
    }
  ];

  public secondaryItemForm: FormGroup<ISecondaryItemForm> = new FormGroup<ISecondaryItemForm>({
    ID: new FormControl<number | null>(null),
    Name: new FormControl<string | null>(null, [
      Validators.required,
      onlyWhiteSpaceValidator(),
      Validators.maxLength(20),
      Validators.minLength(2),
    ]),
    Price: new FormControl<number | null>(null,
      [
        Validators.required,
        Validators.max(500000),
        onlyPositiveNumbers(),
      ]),
  });

  public pending: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private toastService: ToastService,
    private TableService: TableService,
    private titleService: TitleService,
    public translateService: TranslateService
  ) {
    this.titleService.setTitle(Configs.AppMainTitle, this.translateService.instant('SecondaryItems'));
  }

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getProducts(): void {
    this.pending = true;

    this.Request.GetItems<ISecondaryItem[]>('products')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (products: ISecondaryItem[] | null) => {
          this.pending = false;
          this.products = products ? this.Request.MakeArrayFromFirebaseResponse(products)  : [];
          this.secondaryItemTableConfig.TableItems = this.products;
        },
        error: () => {
          this.pending = false;
          this.toastService.showToast(
            'error',
            this.translateService.instant('Error'),
            this.translateService.instant('FailedToGetItems',
              {key: this.translateService.instant('Product')})
          );
        }
      })
  }
}
