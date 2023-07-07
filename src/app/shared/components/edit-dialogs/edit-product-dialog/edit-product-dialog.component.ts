import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { take } from "rxjs";

import { IProduct } from "@Core/interfaces";
import { EditService, RequestsService, ToastService } from "@Core/services";

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.scss']
})
export class EditProductDialogComponent {

  @Input() Product!: IProduct;

  @Input() ProductDialog: boolean = false;
  @Input() ProductForm: FormGroup = new FormGroup({});
  @Output() HideEditDialog: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor(
    private Request: RequestsService,
    private Edition: EditService,
    private toastService: ToastService,
  ) {}

  public submitted: boolean = false;

  public SaveEditedProduct(): void {
    this.submitted = true;
    if (this.ProductForm.valid) {
      this.Request.GetItemFirebaseKey('products', 'ID', this.Product.ID)
        .pipe(take(1))
        .subscribe((items: any) => {
          this.Edition.UpdateItemByFirebaseKey('products', this.ProductForm.value, items[0].key)
            .then(() => {
              this.toastService.showToast('success', 'Done', 'Item Edited Successfully.');
            })
            .catch(() => {
              this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
            });
        });
      this.HideEditDialog.emit(true);
      this.ProductForm.markAsPristine();
    }
  }

}
