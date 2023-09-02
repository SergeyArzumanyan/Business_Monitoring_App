import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import {
  CalculationService,
  EditService,
  RequestsService, TitleService,
  ToastService
} from "@Core/services";
import {
  IPrimaryItem,
  IPrimaryItemFormAdding,
  IPrimaryItemPart,
  IPrimaryItemQuantityForm,
  IPrimaryItemTotalPrices
} from "@Core/interfaces";
import { ITableConfig } from "@Shared/components/table/interfaces";
import { onlyPositiveNumbers } from "@Core/validators";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-primary-item-inner',
  templateUrl: './primary-item-inner.component.html',
  styleUrls: ['./primary-item-inner.component.scss']
})
export class PrimaryItemInnerComponent implements OnInit, OnDestroy {
  public pending: boolean = false;

  public primaryItem!: IPrimaryItem;
  public primaryItemTableConfig: ITableConfig<IPrimaryItemPart[]> = {
    ItemEndPoint: Configs.PrimaryItemEndPoint,
    TableActions: false,
    TableName: 'SecondaryItems',
    ItemName: 'SecondaryItem',
    TableItems: []
  }

  public primaryItemTotalPrices: IPrimaryItemTotalPrices = {
    CurrentTotalPrice: 0,
    Profit: 0
  };

  public isEditMode: boolean = false;

  public editPrimaryItemForm: FormGroup<Partial<IPrimaryItemFormAdding>> = new FormGroup<Partial<IPrimaryItemFormAdding>>({
    ID: new FormControl(null),
    Name: new FormControl(null, [
      Validators.required,
      Validators.maxLength(20)
    ]),
    Profit: new FormControl(null, [
      Validators.required,
      onlyPositiveNumbers()
    ]),
    Image: new FormControl(null, [
      Validators.required
    ]),
    SecondaryItems: this.fb.array([], [
      Validators.required
    ])
  });

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private Edition: EditService,
    private fb: FormBuilder,
    private calculationService: CalculationService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private titleService: TitleService,
    public translateService: TranslateService
  ) {}


  ngOnInit(): void {
    this.getPrimaryItemInnerByID();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public getPrimaryItemInnerByID(): void {
    this.pending = true;
    const primaryItemID = Number(this.route.snapshot.paramMap.get('primary-item-inner-id'));

    if (isNaN(primaryItemID)) {
      this.router.navigateByUrl(Configs.PrimaryItemRoute);
      return;
    }

    this.editPrimaryItemForm.controls.ID?.setValue(primaryItemID);

    this.Request.GetItemByObjectKey(Configs.PrimaryItemEndPoint, 'ID', primaryItemID)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: IPrimaryItem[]) => {
          this.primaryItem = res[0];
          this.primaryItemTableConfig.TableItems = this.primaryItem.SecondaryItems;
          this.calculationService.CalcPrimaryItemTotalPrice(this.primaryItem, this.primaryItem.SecondaryItems!);
          this.titleService.setTitle(this.translateService.instant('PrimaryItem'), this.primaryItem.Name!)
          this.pending = false;
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Get Selected primaryItem.');
          this.pending = false;
        }
      })
  }

  public createFormGroup(itemValue: any): FormGroup {
    return new FormGroup<IPrimaryItemQuantityForm>({
      ID: new FormControl(itemValue.ID),
      Name: new FormControl(itemValue.Name),
      Quantity: new FormControl(itemValue.Quantity, Validators.required)
    });
  }

  public enableEditing(): void {
    this.isEditMode = true;

    for (let i = 0; i < this.primaryItem.SecondaryItems!.length; i++) {
      const formGroup: FormGroup = this.createFormGroup(this.primaryItem);
      this.editPrimaryItemForm.controls.SecondaryItems!.setControl(i, formGroup);
    }
  }

  public disableEditing(): void {
    this.isEditMode = false;
    this.editPrimaryItemForm.controls.SecondaryItems!.clear();
    this.editPrimaryItemForm.markAsPristine();
  }

  public disableEditingInModal(disableFromModal: boolean): void {
    if (disableFromModal) {
      this.disableEditing();
    }
  }

  public onEdit(): void {
    if (this.editPrimaryItemForm.valid) {
      this.Edition.UpdateItemByFirebaseKey(
        Configs.PrimaryItemEndPoint,
        this.editPrimaryItemForm.value,
        this.primaryItem.ID!.toString()
      );
      this.disableEditing();
      this.toastService.showToast(
        'success',
        this.translateService.instant('Done'),
        this.translateService.instant('EditedItemSuccessfully',
          { key: this.translateService.instant('PrimaryItem') }
        )
      );
    } else {
      this.editPrimaryItemForm.markAllAsTouched();
    }
  }
}
