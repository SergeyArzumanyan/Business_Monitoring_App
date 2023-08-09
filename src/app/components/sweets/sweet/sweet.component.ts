import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";

import {
  CalculationService,
  EditService,
  RequestsService,
  ToastService
} from "@Core/services";
import {
  ISweet,
  ISweetFormAdding,
  ISweetProduct,
  ISweetQuantityForm,
  ISweetTotalPrices
} from "@Core/interfaces";
import { ITableConfig } from "@Shared/components/table/interfaces";
import { onlyPositiveNumbers } from "@Core/validators";

@Component({
  selector: 'app-sweet',
  templateUrl: './sweet.component.html',
  styleUrls: ['./sweet.component.scss']
})
export class SweetComponent implements OnInit, OnDestroy {
  public pending: boolean = false;

  public sweet!: ISweet;
  public sweetTableConfig: ITableConfig<ISweetProduct[]> = {
    ItemEndPoint: 'sweets',
    TableActions: false,
    TableName: 'Products',
    ItemName: 'Product',
    TableItems: []
  }

  public sweetTotalPrices: ISweetTotalPrices = {
    CurrentTotalPrice: 0,
    Profit: 0
  };

  public isEditMode: boolean = false;

  public editSweetForm: FormGroup<Partial<ISweetFormAdding>> = new FormGroup<Partial<ISweetFormAdding>>({
    ID: new FormControl(null),
    Name: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    Profit: new FormControl(null, [Validators.required, onlyPositiveNumbers()]),
    Image: new FormControl(null, [Validators.required]),
    Products: this.fb.array([], [Validators.required])
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
  ) {}


  ngOnInit(): void {
    this.getSweetByID();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public getSweetByID(): void {
    this.pending = true;
    const sweetID = Number(this.route.snapshot.paramMap.get('sweet-id'));

    if (isNaN(sweetID)) {
      this.router.navigateByUrl('sweets');
      return;
    }

    this.editSweetForm.controls.ID?.setValue(sweetID);

    this.Request.GetItemByObjectKey('sweets', 'ID', sweetID)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res: ISweet[]) => {
          this.sweet = res[0];
          this.sweetTableConfig.TableItems = this.sweet.Products;
          this.calculationService.calcTotalSweetPrice(this.sweet, this.sweet.Products!);
          this.pending = false;
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Get Selected Sweet.');
          this.pending = false;
        }
      })
  }

  public createFormGroup(itemValue: any): FormGroup {
    return new FormGroup<ISweetQuantityForm>({
      ID: new FormControl(itemValue.ID),
      Name: new FormControl(itemValue.Name),
      Quantity: new FormControl(itemValue.Quantity, Validators.required)
    });
  }

  public enableEditing(): void {
    this.isEditMode = true;

    for (let i = 0; i < this.sweet.Products!.length; i++) {
      const formGroup: FormGroup = this.createFormGroup(this.sweet);
      this.editSweetForm.controls.Products!.setControl(i, formGroup);
    }
  }

  public disableEditing(): void {
    this.isEditMode = false;
    this.editSweetForm.controls.Products!.clear();
    this.editSweetForm.markAsPristine();
  }

  public disableEditingInModal(disableFromModal: boolean): void {
    if (disableFromModal) {
      this.disableEditing();
    }
  }

  public onEdit(): void {
    if (this.editSweetForm.valid) {
      this.Edition.UpdateItemByFirebaseKey(
        'sweets',
        this.editSweetForm.value,
        this.sweet.ID!.toString()
      );
      this.disableEditing();
      this.toastService.showToast('success', 'Done', 'Sweet Updated Successfully.');
    } else {
      this.editSweetForm.markAllAsTouched();
    }
  }
}
