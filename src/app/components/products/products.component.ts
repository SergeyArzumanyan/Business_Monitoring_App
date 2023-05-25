import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, take, takeUntil } from "rxjs";

import { onlyPositiveNumbers } from "@Validators/only-positive-numbers.validator";
import { IProduct, IProductForm } from "@Interfaces/product.interface";
import { RequestsService } from "@Services/requests.service";
import { EditService } from "@Services/edit.service";
import { DeleteService } from "@Services/delete.service";
import { ToastService } from "@Services/toast.service";

import { AngularFireDatabase } from "@angular/fire/compat/database";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public products: IProduct[] | null = [];
  private product: IProduct | null = null;

  private unsubscribe$: Subject<void> = new Subject<void>();

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

  constructor(
    private Request: RequestsService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private db: AngularFireDatabase,
    private Deletion: DeleteService,
    private Edition: EditService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getProducts(): void {
    this.Request.getProducts()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe({
        next: (products: IProduct[] | null) => {
          this.products = this.Request.makeArray(products);
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Get Products');
        }
      })
  }

  public deleteProduct(product: IProduct): void {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this product?',
      header: 'Delete Product ?',
      icon: 'pi pi-trash',
      accept: () => {
      this.Deletion.deleteItem('products', 'ID', product.ID)
        .subscribe((actions: any) => {
          actions.forEach((action: any) => {
            const key = action.payload.key;
            this.db.object(`/products/${key}`).remove()
              .then(() => {
                this.toastService.showToast('success', 'Done', 'Product Deleted Successfully.');
              })
              .catch(() => {
                this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
              });
          });
        });
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
    if (this.productForm.valid && this.productForm.value.Name?.trim() && this.productForm.value.Price && this.product?.ID) {
      this.Edition.editItem('products', 'ID', this.product?.ID)
        .pipe(take(1))
        .subscribe((items: any) => {
          this.db.list('/products').update(items[0].key, this.productForm.value)
            .then(() => {
              this.toastService.showToast('success', 'Done', 'Product Edited Successfully.');
            })
            .catch(() => {
              this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
            });
        });
      this.ProductDialog = false;
      this.productForm.markAsPristine();
    }
  }
}
