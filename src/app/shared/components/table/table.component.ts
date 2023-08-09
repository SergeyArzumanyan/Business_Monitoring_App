import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { BehaviorSubject, filter, Subject, takeUntil } from "rxjs";
import { NavigationStart, Router } from "@angular/router";

import {
  IContextMenuItem,
  IContextMenuPosition,
  ITableConfig,
} from "@Shared/components/table/interfaces";

import { TableService, TableSortingService } from "@Shared/components/table/services";
import { ITableFilters, ITableFiltersObj } from "@Shared/components/table/filters/interfaces";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  // #TODO Should Delete This Part After Backend Refactor

  public isClientsTable: boolean = false;

  //

  @Input() TableConfig!: ITableConfig<any>;
  @Input() IsTableHeightLimited: boolean = false;

  @Input() ShowTableFilters: boolean = true;
  @Input() TableFilters: ITableFilters | null = null;

  public TableFiltersObj: ITableFiltersObj = {};
  public TableRowItem: any;
  public SortingColumName: string = '';

  public IsEditDialogVisible: boolean = false;
  @Input() EditDialogForm: FormGroup = new FormGroup({});
  public FormIsSubmitted: boolean = false;

  @Input() Pending: boolean = false;

  @Input() ContextMenuItems: IContextMenuItem[] = [];
  public ShowContextMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public ContextMenuPosition: IContextMenuPosition = { x: 0, y: 0 };

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public TableService: TableService,
    public TableSortingService: TableSortingService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.SubscribeToEditModeChanges();
    this.subscribeToRouteChanges();

  //
    if (this.router.url.includes('clients')) {
      this.isClientsTable = true;
    }

  //
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.TableService.InitialTableItems = [];
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

  private subscribeToRouteChanges(): void {
    this.router.events
      .pipe(
        filter((event): boolean => event instanceof NavigationStart),
      ).subscribe({
      next: () => {
        this.IsEditDialogVisible = false;
        this.TableService.isEditDialogVisible.next(false);
      }
    });
  }

  protected DeleteItem(Item: any): void {
    this.TableService.DeleteItem(this.TableConfig, Item);
    this.TableService.InitialTableItems = this.TableConfig.TableItems;
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
      this.TableService.InitialTableItems = this.TableConfig.TableItems;
      this.IsEditDialogVisible = false;
      this.EditDialogForm.markAsPristine();
      this.FormIsSubmitted = false;
    }
  }

  protected MakeTooltip(value: any): string {
    if (typeof (value) === 'string') {
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

  public ApplyFiltersToTable(filters: ITableFiltersObj): void {
    this.TableFiltersObj = filters;
    if (this.TableService.InitialTableItems.length === 0) {
      this.TableService.InitialTableItems = this.TableConfig.TableItems;
    }

    for (const filterKeyValue of Object.entries(this.TableFiltersObj)) {
      if (filterKeyValue[1]) {
        if (typeof filterKeyValue[1] === 'string') {
          this.TableConfig.TableItems = this.TableService.InitialTableItems.filter((TableItem: any) =>
            TableItem[filterKeyValue[0]].toLowerCase().includes(filterKeyValue[1].trim().toLowerCase()));
        } else if (typeof filterKeyValue[1] === 'number') {
          this.TableConfig.TableItems = this.TableService.InitialTableItems.filter((TableItem: any) =>
            TableItem['Price'] === filterKeyValue[1]);
        }
      } else if (filterKeyValue[1] === '') {
        this.TableConfig.TableItems = this.TableService.InitialTableItems;
      }
    }

  }

  public SortTableField(key: any): void {
    this.SortingColumName = key;

    if (this.TableService.InitialTableItems.length === 0) {
      this.TableService.InitialTableItems = Array.from(this.TableConfig.TableItems);
    }

    const sortedItems: any[] = this.TableSortingService.SortTableField(key, this.TableService.InitialTableItems);

    sortedItems.length > 0 ?
      this.TableConfig.TableItems = sortedItems :
      this.TableConfig.TableItems = this.TableService.InitialTableItems;
  }
}
