import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { BehaviorSubject, Subject, takeUntil } from "rxjs";

import {
  IContextMenuItem,
  IContextMenuPosition,
  ITableConfig,
} from "@Shared/components/table/interfaces";

import { TableService } from "@Shared/components/table/services";
import { ITableFilters } from "app/shared/components/table/filters/interfaces";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  @Input() TableConfig!: ITableConfig<any>;
  @Input() TableFilters: ITableFilters | null = null;

  public TableRowItem: any;
  public IsEditDialogVisible: boolean = false;
  @Input() EditDialogForm: FormGroup = new FormGroup({});
  public FormIsSubmitted: boolean = false;

  @Input() Pending: boolean = false;

  @Input() ContextMenuItems: IContextMenuItem[] = [];
  public ShowContextMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public ContextMenuPosition: IContextMenuPosition = { x: 0, y: 0 };

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private TableService: TableService) {}

  ngOnInit(): void {
    this.SubscribeToEditModeChanges();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private SubscribeToEditModeChanges(): void {
    this.TableService.isEditDialogVisible
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (EditDialogStatus: boolean) => {
          this.IsEditDialogVisible = EditDialogStatus;
        }
    });
  }

  protected DeleteItem(Item: any): void {
    this.TableService.DeleteItem(this.TableConfig, Item);
  }

  protected EnableEditing(Item: any): void {
    this.TableService.EditDialogForm.next(this.EditDialogForm);
    this.TableRowItem = Item;
    this.TableService.PatchItemToDialogForm(Item);
    this.TableService.EnableTableRowEdit(Item);
  }

  protected HideEditDialog(): void {
    this.IsEditDialogVisible = false;
    this.TableService.isEditDialogVisible.next(false);
  }

  protected HideDialogInEditDialog(hidedFromEditDialog: boolean): void {
    if (hidedFromEditDialog) {
      this.HideEditDialog();
    }
  }

  protected SaveEditedItem(): void {
    this.FormIsSubmitted = true;
    if (this.EditDialogForm.valid) {
      this.TableService.EditItem(this.TableConfig, this.TableRowItem, this.EditDialogForm.value);
      this.IsEditDialogVisible = false;
      this.EditDialogForm.markAsPristine();
      this.FormIsSubmitted = false;
    }
  }

  protected MakeTooltip(value: any): string {
    if ( typeof(value) === 'string' ) {
      return value;
    } else {
      return value.toString();
    }
  }

  protected OpenContextMenu(evn: any, Item: any): void {
    evn.preventDefault();
    this.TableRowItem = Item;
    this.ShowContextMenu.next(true);
    this.ContextMenuPosition = {
      x: evn.pageX,
      y: evn.pageY
    }
  }
}
