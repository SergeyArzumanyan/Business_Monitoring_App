import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { take } from "rxjs";

import { EditService, RequestsService, ToastService } from "@Core/services";

@Component({
  selector: 'app-table-edit-dialog',
  templateUrl: './table-edit-dialog.component.html',
  styleUrls: ['./table-edit-dialog.component.scss']
})
export class TableEditDialogComponent {
  @Input() IsDialogVisible: boolean = false;
  @Output() HideEditDialog: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Input() TableItemName: string = '';
  @Input() TableItemEndPoint: string = '';

  @Input() TableItem: any = null;
  @Input() TableItemForm: FormGroup = new FormGroup({});

  @Input() FormIsSubmitted: boolean = false;

  constructor(
    private Request: RequestsService,
    private Edition: EditService,
    private toastService: ToastService,
  ) {}

  public checkControlValueType(Control: any): string {
    return typeof Control === 'string' ? 'string' : 'number';
  }

  public SaveEditedItem(): void {
    this.FormIsSubmitted = true;
    if (this.TableItemForm.valid) {
      this.Request.GetItemFirebaseKey(this.TableItemEndPoint, 'ID', this.TableItem.ID)
        .pipe(take(1))
        .subscribe((items: any) => {
          this.Edition.UpdateItemByFirebaseKey(this.TableItemEndPoint, this.TableItemForm.value, items[0].key)
            .then(() => {
              this.toastService.showToast('success', 'Done', `${this.TableItemName} Edited Successfully.`);
            })
            .catch(() => {
              this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
            });
        })
      this.HideEditDialog.next(true);
      this.FormIsSubmitted = false;
      this.TableItemForm.markAsPristine();
    }
  }

}
