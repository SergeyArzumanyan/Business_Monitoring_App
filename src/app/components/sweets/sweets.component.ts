import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from "rxjs";

import {
  ISweet,
  IProduct
} from "@Core/interfaces";
import {
  RequestsService,
  DeleteService,
  ToastService
} from "@Core/services";

import { AngularFireDatabase } from "@angular/fire/compat/database";
import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-sweets',
  templateUrl: './sweets.component.html',
  styleUrls: ['./sweets.component.scss']
})
export class SweetsComponent implements OnInit {

  public sweets: ISweet[] = [];
  private subscribeToSweetChanges: Subscription | null = null;

  public stopLoading: boolean = false;

  constructor(
    private Request: RequestsService,
    private Deletion: DeleteService,
    private router: Router,
    private db: AngularFireDatabase,
    private confirmationService: ConfirmationService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.requestSweets();
  }

  private requestSweets(): void {
    this.subscribeToSweetChanges = this.Request.getSweets()
      .subscribe({
        next: (sweets: ISweet[] | null) => {
          this.sweets = sweets ? this.Request.makeArray(sweets) : [];
          this.getProductsBasedOnSweets(this.sweets);

          setTimeout(() => {
            if (this.sweets.length === 0) {
              this.stopLoading = true;
            }
          }, 5000);
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Get Sweets');

        }
      })
  }

  private getProductsBasedOnSweets(sweets: ISweet[]): void {
    for (const sweet of sweets) {
      if (sweet.Products) {
        for (const product of sweet.Products) {
          const productQuantity = product.Quantity;

          this.Request.getProductsBasedOnSweet(product.ProductID)
            .subscribe({
              next: (product: IProduct[]) => {
                if (!sweet.TotalPrice) {
                  sweet.TotalPrice = product[0].Price * productQuantity;
                } else {
                  sweet.TotalPrice += product[0].Price * productQuantity;
                }
              },
              error: (err: HttpErrorResponse) => {
                this.toastService.showToast('error', 'Error', err.message);
              }
            })
        }
      }
    }
  }

  public deleteSweet(sweet: ISweet): void {

    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this sweet?',
      header: 'Delete Sweet ?',
      icon: 'pi pi-trash',
      accept: () => {
        this.Deletion.deleteItem('sweets', 'ID', sweet.ID)
          .subscribe((actions: any) => {
            actions.forEach((action: any) => {
              const key = action.payload.key;
              this.db.object(`/sweets/${key}`).remove()
                .then(() => {
                  this.toastService.showToast('success', 'Done', 'Sweet Deleted Successfully.');
                })
                .catch(() => {
                  this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
                });
            });
          });
      }
    });



  }

  public editSweet(ID: number | null): void {
    this.router.navigateByUrl(`sweets/${ID}`);
  }

}
