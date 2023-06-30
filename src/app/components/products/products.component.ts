import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, take, takeUntil } from "rxjs";

import { onlyPositiveNumbers } from "@Core/validators";
import {
  IProduct,
  IProductForm,
  IFirebaseItemDeletion,
} from "@Core/interfaces";
import {
  RequestsService,
  EditService,
  DeleteService,
  ToastService,
} from "@Core/services";

import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public isMobile = false;
  @HostListener("window:resize", ["$event.target"])
  private onWindowResize(): void {
    this.isMobile = (window.innerWidth <= 900);
  }

  public products: IProduct[] | null = [];
  private product: IProduct | null = null;

  public pending: boolean = false;

  public ProductDialog: boolean = false;
  public productForm: FormGroup<IProductForm> = new FormGroup<IProductForm>({
    Name: new FormControl<string | null>(null, [
      Validators.maxLength(20),
      Validators.minLength(2)
    ]),
    Price: new FormControl<number | null>(null,
      [
        Validators.max(500000),
        onlyPositiveNumbers()
      ]),
  });
  public submitted: boolean = false;

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private Deletion: DeleteService,
    private Edition: EditService,
    private toastService: ToastService,
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

    this.Request.getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (products: IProduct[] | null) => {
          this.pending = false;
          this.products = products ? this.Request.makeArray(products)  : [];
        },
        error: () => {
          this.pending = false;
          this.toastService.showToast('error', 'Error', 'Failed To Get Products');
        }
      })
  }

  public deleteProduct(product: IProduct): void {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this product?',
      header: 'Delete Product ?',
      icon: 'pi pi-trash icon-big',
      accept: () => {
      this.Deletion.deleteItem('products', 'ID', product.ID)
        .pipe(take(1))
      .subscribe({
          next: (action: IFirebaseItemDeletion[]) => {
            this.Deletion.removeItem('products', action[0].payload.key, 'Product', true);
            this.toastService.showToast('success', 'Done', 'Product Deleted Successfully');
          },
          error: () => {
            this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
          }
        })
      }
    });
  }

  public editProduct(product: IProduct): void {
    this.product = product;
    this.productForm.patchValue(product);
    this.ProductDialog = true;
  }

  public hideProductDialog(): void {
    this.productForm.reset();
    this.ProductDialog = false;
    this.submitted = false;
  }

  public saveProduct(): void {
    this.submitted = true;
    this.pending = true;
    if (this.productForm.valid && this.productForm.value.Name?.trim() && this.productForm.value.Price && this.product?.ID) {
      this.Edition.editItem('products', 'ID', this.product?.ID)
        .pipe(take(1))
        .subscribe((items: any) => {
          this.Edition.updateCurrentItem('products', this.productForm.value, items[0].key)
            .then(() => {
              this.pending = false;
              this.toastService.showToast('success', 'Done', 'Product Edited Successfully.');
            })
            .catch(() => {
              this.pending = false;
              this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
            });
        });
      this.ProductDialog = false;
      this.productForm.markAsPristine();
    }
  }
}
