import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { onlyPositiveNumbers, onlyWhiteSpaceValidator } from "@Core/validators";
import {
  IProduct,
  IProductForm,
} from "@Core/interfaces";
import {
  RequestsService,
  ToastService,
} from "@Core/services";

import {
  IContextMenuItem,
  ITableConfig,
} from "@Shared/components/table/interfaces";
import { ITableFilters } from "@Shared/components/filters/interfaces";

import { TableService } from '@Shared/components/table/services'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public products: IProduct[] | null = [];

  public productTableConfig: ITableConfig<IProduct[]> = {
    TableItems: [],
    TableName: 'Products',
    ItemName: 'Product',
    TableActions: true,
    ItemApiName: 'products'
  };

  public ProductTableFilters: ITableFilters = {
    ShowName: true,
    ShowPrice: true
  };

  public productTableContextMenuOptions: IContextMenuItem[] = [
    {
      Label: 'Edit',
      IconClass: 'pi pi-pencil',
      Action: (Item: IProduct): void =>  {
        this.TableService.EditDialogForm.next(this.ProductForm);
        this.TableService.EnableTableRowEdit(Item);
      }
    },
    {
      Label: 'Delete',
      IconClass: 'pi pi-trash',
      Action: (Item: IProduct): void => {
        this.TableService.EditDialogForm.next(this.ProductForm);
        this.TableService.DeleteItem(this.productTableConfig, Item)
      }
    }
  ];

  public ProductForm: FormGroup<IProductForm> = new FormGroup<IProductForm>({
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
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getProducts(): void {
    this.pending = true;

    this.Request.GetItems<IProduct[]>('products')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (products: IProduct[] | null) => {
          this.pending = false;
          this.products = products ? this.Request.MakeArrayFromFirebaseResponse(products)  : [];
          this.productTableConfig.TableItems = this.products;
        },
        error: () => {
          this.pending = false;
          this.toastService.showToast('error', 'Error', 'Failed To Get Products');
        }
      })
  }
}
