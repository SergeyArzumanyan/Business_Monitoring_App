import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import {
  ISweet,
  IProduct,
  ISweetFormAdding,
  ISweetQuantityForm,
  ISweetTotalPrices,
} from "@Core/interfaces";
import {
  SendingDataService,
  RequestsService,
  ToastService, CalculationService
} from "@Core/services";
import { onlyPositiveNumbers } from "@Core/validators";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-add-sweet',
  templateUrl: './add-sweet.component.html',
  styleUrls: ['./add-sweet.component.scss']
})
export class AddSweetComponent implements OnInit, OnDestroy {

  public sweet: Partial<ISweet> = {};
  public sweetTotalPrices: ISweetTotalPrices = {
    CurrentTotalPrice: 0,
    Profit: 0
  };

  public products: IProduct[] = [];
  public selectedProducts: any = [];

  public addSweetForm: FormGroup<ISweetFormAdding> = new FormGroup<ISweetFormAdding>({
    ID: new FormControl(null),
    Name: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
    Image: new FormControl(null, [Validators.required]),
    Products: this.fb.array([], Validators.required),
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
    public translateService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.requestProducts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private requestProducts(): void {
    this.Request.GetItems<IProduct[]>('products')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (products: IProduct[] | null) => {
          this.products = products ? this.Request.MakeArrayFromFirebaseResponse(products) : [];
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
        this.addSweetForm.controls.Image.setValue(reader.result as string);
      };

    }
  }

  public imageDropped(Image: any): void {
    this.addSweetForm.controls.Image.setValue(Image);
  }

  public imageClear(sweet: any): void {
    sweet.Image = null
    this.addSweetForm.controls.Image.setValue(null);
    this.addSweetForm.controls.Image.markAsTouched();
    this.addSweetForm.patchValue(sweet);
  }

  public onAdd(): void {
    setTimeout(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
      this.addSweetForm.value.Image = this.addSweetForm.controls.Image.value;
      this.addSweetForm.controls.ID.setValue(+(new Date()));

      if (this.addSweetForm.valid) {
        this.Send.CreateItem<ISweet>('sweets', 'Sweet', this.addSweetForm.value)
        this.addSweetForm.controls.Products.clear();
        this.addSweetForm.reset();
        this.selectedProducts = [];
        this.sweetTotalPrices.CurrentTotalPrice = 0;
        this.sweetTotalPrices.Profit = 0;
      } else {
        this.addSweetForm.markAllAsTouched();
      }
    }, 500);

  }

  public createItem(evn: any): void {
    const items: FormArray = this.addSweetForm.controls['Products'] as FormArray;

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

    this.calculateSweetTotalPrice();
  }

  public createFormGroup(itemValue: any): FormGroup {
    return new FormGroup<ISweetQuantityForm>({
      ID: new FormControl(itemValue.ID),
      Name: new FormControl(itemValue.Name),
      Quantity: new FormControl(1, Validators.required)
    });
  }

  public productsAsFormArray(): FormArray {
    return this.addSweetForm.controls['Products'] as FormArray;
  }

  public getFormGroup(i: number): FormGroup {
    return this.productsAsFormArray().controls[i] as FormGroup;
  }

  public removeFormGroup(i: number): void {
    const items: FormArray = this.productsAsFormArray();
    items.removeAt(i);

    const oldSelected: string[] = [...this.selectedProducts];
    oldSelected.splice(i, 1);
    this.selectedProducts = oldSelected;

    this.calculateSweetTotalPrice();
  }

  public sweetSelectionChangedWithInput(evn: any): void {
    if (evn.hasOwnProperty('value')) {
      this.calculateSweetTotalPrice();
    } else if (evn.key && (evn.key.match(/[0-9]/) || evn.key === 'Backspace' || evn.key === 'Delete')) {
      this.calculateSweetTotalPrice();
    }
  }

  private calculateSweetTotalPrice(): void {
    setTimeout(() => {
      this.calculationService.CalculateSweetTotalPrice(this.addSweetForm.value, this.sweetTotalPrices);
    }, 500)
  }
}
