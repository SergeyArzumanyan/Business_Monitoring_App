import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import {
  IPrimaryItem,
  ISecondaryItem,
  IPrimaryItemFormAdding,
  IPrimaryItemQuantityForm,
  IPrimaryItemTotalPrices,
} from "@Core/interfaces";
import {
  SendingDataService,
  RequestsService,
  ToastService, CalculationService, TitleService
} from "@Core/services";
import { onlyPositiveNumbers } from "@Core/validators";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-add-primary-item-inner',
  templateUrl: './add-primary-item.component.html',
  styleUrls: ['./add-primary-item.component.scss']
})
export class AddPrimaryItemComponent implements OnInit, OnDestroy {

  public primaryItem: Partial<IPrimaryItem> = {};
  public primaryItemTotalPrices: IPrimaryItemTotalPrices = {
    CurrentTotalPrice: 0,
    Profit: 0
  };

  public secondaryItems: ISecondaryItem[] = [];
  public selectedSecondaryItems: any = [];

  public addPrimaryItemTotalPricesForm: FormGroup<IPrimaryItemFormAdding> = new FormGroup<IPrimaryItemFormAdding>({
    ID: new FormControl(null),
    Name: new FormControl(null, [
      Validators.required,
      Validators.maxLength(20)]
    ),
    Image: new FormControl(null, [
      Validators.required
    ]),
    SecondaryItems: this.fb.array([], [
      Validators.required
    ]),
    Profit: new FormControl(null, [
      Validators.required,
      onlyPositiveNumbers()
    ])
  })

  private unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private calculationService: CalculationService,
    private Request: RequestsService,
    private Send: SendingDataService,
    private toastService: ToastService,
    private titleService: TitleService,
    public translateService: TranslateService
  ) {
    this.titleService.setTitle(this.translateService.instant('Add'), this.translateService.instant('PrimaryItem'));
  }

  ngOnInit(): void {
    this.requestSecondaryItems();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private requestSecondaryItems(): void {
    this.Request.GetItems<ISecondaryItem[]>(Configs.SecondaryItemEndPoint)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (secondaryItems: ISecondaryItem[] | null) => {
          this.secondaryItems = secondaryItems ? this.Request.MakeArrayFromFirebaseResponse(secondaryItems) : [];
        },
        error: () => {
          this.toastService.showToast(
            'error',
            this.translateService.instant('Error'),
            this.translateService.instant('FailedToGetItems',
              {key: this.translateService.instant('Product')})
          );
        }
      });
  }

  public onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.addPrimaryItemTotalPricesForm.controls.Image.setValue(reader.result as string);
      };

    }
  }

  public imageDropped(Image: any): void {
    this.addPrimaryItemTotalPricesForm.controls.Image.setValue(Image);
  }

  public imageClear(primaryItem: any): void {
    primaryItem.Image = null
    this.addPrimaryItemTotalPricesForm.controls.Image.setValue(null);
    this.addPrimaryItemTotalPricesForm.controls.Image.markAsTouched();
    this.addPrimaryItemTotalPricesForm.patchValue(primaryItem);
  }

  public onAdd(): void {
    setTimeout(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
      this.addPrimaryItemTotalPricesForm.value.Image = this.addPrimaryItemTotalPricesForm.controls.Image.value;
      this.addPrimaryItemTotalPricesForm.controls.ID.setValue(+(new Date()));

      if (this.addPrimaryItemTotalPricesForm.valid) {
        this.Send.CreateItem<IPrimaryItem>(
          Configs.PrimaryItemEndPoint,
          'PrimaryItem',
          this.addPrimaryItemTotalPricesForm.value
        );
        this.addPrimaryItemTotalPricesForm.controls.SecondaryItems.clear();
        this.addPrimaryItemTotalPricesForm.reset();
        this.selectedSecondaryItems = [];
        this.primaryItemTotalPrices.CurrentTotalPrice = 0;
        this.primaryItemTotalPrices.Profit = 0;
      } else {
        this.addPrimaryItemTotalPricesForm.markAllAsTouched();
      }
    }, 500);

  }

  public createItem(evn: any): void {
    const items: FormArray = this.addPrimaryItemTotalPricesForm.controls['SecondaryItems'] as FormArray;

    if (evn.itemValue) {
      const idx = items.controls.findIndex((item: AbstractControl) =>
        item.value.ID === evn.itemValue.ID);
      if (idx === -1) {
        items.push(this.createFormGroup(evn.itemValue))
      } else {
        items.removeAt(idx);
      }
    } else {
      items.clear();
    }

    this.calculatePrimaryItemTotalPrice();
  }

  public createFormGroup(itemValue: any): FormGroup {
    return new FormGroup<IPrimaryItemQuantityForm>({
      ID: new FormControl(itemValue.ID),
      Name: new FormControl(itemValue.Name),
      Quantity: new FormControl(1, Validators.required)
    });
  }

  public SecondaryItemsAsFormArray(): FormArray {
    return this.addPrimaryItemTotalPricesForm.controls['SecondaryItems'] as FormArray;
  }

  public getFormGroup(i: number): FormGroup {
    return this.SecondaryItemsAsFormArray().controls[i] as FormGroup;
  }

  public removeFormGroup(i: number): void {
    const items: FormArray = this.SecondaryItemsAsFormArray();
    items.removeAt(i);

    const oldSelected: string[] = [...this.selectedSecondaryItems];
    oldSelected.splice(i, 1);
    this.selectedSecondaryItems = oldSelected;

    this.calculatePrimaryItemTotalPrice();
  }

  public primaryItemSelectionChangedWithInput(evn: any): void {
    if (evn.hasOwnProperty('value')) {
      this.calculatePrimaryItemTotalPrice();
    } else if (evn.key && (evn.key.match(/[0-9]/) || evn.key === 'Backspace' || evn.key === 'Delete')) {
      this.calculatePrimaryItemTotalPrice();
    }
  }

  private calculatePrimaryItemTotalPrice(): void {
    setTimeout(() => {
      this.calculationService.CalculatePrimaryItemTotalPrice(
        this.addPrimaryItemTotalPricesForm.value,
        this.primaryItemTotalPrices
      );
    }, 500)
  }
}
