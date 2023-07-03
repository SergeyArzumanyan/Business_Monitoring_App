import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import { onlyPositiveNumbers, onlyWhiteSpaceValidator } from "@Core/validators";
import {
  IProduct,
  IProductForm,
} from "@Core/interfaces";
import {
  RequestsService,
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
    private confirmationService: ConfirmationService,
    private router: Router,
    private Deletion: DeleteService,
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
}
