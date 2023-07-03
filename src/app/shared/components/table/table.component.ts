import { Component, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { take } from "rxjs";

import { IFirebaseItemDeletion } from "@Core/interfaces";
import {
  DeleteService,
  EditService,
  ToastService,
} from "@Core/services";

import { ConfirmationService } from "primeng/api";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {

  @Input() TableItems: any[] | null = [];
  @Input() TableName: string = '';
  @Input() TableActions: boolean = false;
  @Input() ItemName: string = '';

  public RowElement: any = null;
  @Input() EditDialogForm: FormGroup = new FormGroup({});

  @Input() showName: boolean = false;
  @Input() showPrice: boolean = false;

  @Input() ItemApiName: string = '';
  @Input() Pending: boolean = false;

  public EditDialog: boolean = false;
  public DialogItem: any = null;

  constructor(
    private Deletion: DeleteService,
    private Edition: EditService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
  ) {}

  public deleteItem(Item: any): void {
    this.confirmationService.confirm({
      message: `Are You Sure That You Want To Delete This ${this.ItemName}?`,
      header: `Delete ${this.ItemName} ?`,
      icon: 'pi pi-trash icon-big',
      accept: () => {
        this.Deletion.deleteItem(this.ItemApiName, 'ID', Item.ID)
          .pipe(take(1))
          .subscribe({
            next: (action: IFirebaseItemDeletion[]) => {
              this.Deletion.removeItem(this.ItemApiName, action[0].payload.key, this.ItemName);
            },
            error: () => {
              this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
            }
          })
      }
    });
  }

  public hideEditDialog(): void {
    this.EditDialog = false;
  }

  public hideFromChildren(evn: any): void {
    if (evn) {
      this.hideEditDialog();
    }
  }

  public saveItem(): void {
    this.Edition.editItem('products', 'ID', this.RowElement.ID)
      .pipe(take(1))
      .subscribe((items: any) => {
        this.Edition.updateCurrentItem('products', this.EditDialogForm.value, items[0].key)
          .then(() => {
            this.toastService.showToast('success', 'Done', 'Item Edited Successfully.');
          })
          .catch(() => {
            this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
          });
      });
    this.EditDialog = false;
    this.EditDialogForm.markAsPristine();
  }


  public editItem(Item: any): void {
    this.RowElement = Item;
    this.EditDialogForm.patchValue(Item);
    this.DialogItem = Item;
    this.EditDialog = true;
  }

  public makeTooltip(value: any): string {
    if (typeof(value) === 'string') {
      return value;
    } else {
      return value.toString();
    }
  }
}
