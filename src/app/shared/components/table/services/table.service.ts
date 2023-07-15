import { Injectable } from '@angular/core';
import { BehaviorSubject, take } from "rxjs";

import { IFirebaseItemDeletion } from "@Core/interfaces";
import {
  RequestsService,
  DeleteService,
  EditService,
  ToastService,
} from "@Core/services";

import { ITableConfig } from "@Shared/components/table/interfaces";

import { ConfirmationService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})

export class TableService {

  public InitialTableItems: any[] = [];
  public TableRowItem: any = null;
  public isEditDialogVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public EditDialogForm: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private Request: RequestsService,
    private Edition: EditService,
    private Deletion: DeleteService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
  ) {}

  public DeleteItem(TableConfigs: ITableConfig<any>, Item: any): void {
    this.confirmationService.confirm({
      message: `Are You Sure That You Want To Delete This ${TableConfigs.ItemName}?`,
      header: `Delete ${TableConfigs.ItemName} ?`,
      icon: 'pi pi-trash icon-big',
      accept: (): void => {
        this.Request.GetItemFirebaseKey(TableConfigs.ItemEndPoint, 'ID', Item.ID)
          .pipe(take(1))
          .subscribe({
            next: (action: IFirebaseItemDeletion[]): void => {
              this.Deletion.RemoveItemByFirebaseKey(TableConfigs.ItemEndPoint, action[0].payload.key, TableConfigs.ItemName)
                .then((): void => {
                  this.InitialTableItems = TableConfigs.TableItems;
                });
            },
            error: (): void => {
              this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
            }
          });
      }
    });
  }

  public EnableTableRowEdit(Item: any): void {
    this.TableRowItem = Item;
    this.isEditDialogVisible.next(true);
    this.PatchItemToDialogForm(Item);
  }

  public PatchItemToDialogForm(Item: any): void {
    this.EditDialogForm.getValue().patchValue(Item);
  }

  public EditItem(TableConfigs: ITableConfig<any>, Item: any, ItemNewValue: any): any {
    this.Request.GetItemFirebaseKey(`${TableConfigs.ItemEndPoint}`, 'ID', Item.ID)
      .pipe(take(1))
      .subscribe((items: any): void => {
        this.Edition.UpdateItemByFirebaseKey(`${TableConfigs.ItemEndPoint}`, ItemNewValue, items[0].key)
          .then((): boolean => {
            this.InitialTableItems =TableConfigs.TableItems;
            this.toastService.showToast('success', 'Done', `${TableConfigs.ItemName} Edited Successfully.`);
            return true;
          })
          .catch((): boolean => {
            this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
            return false;
          });
      });
  }
}
