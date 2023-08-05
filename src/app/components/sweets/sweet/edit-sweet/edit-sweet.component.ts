import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import {
  CalculationService,
  RequestsService,
  ToastService
} from "@Core/services";
import {
  IProduct,
  ISweet,
  ISweetProduct,
  ISweetQuantityForm,
  ISweetTotalPrices
} from "@Core/interfaces";

@Component({
  selector: 'app-edit-sweet',
  templateUrl: './edit-sweet.component.html',
  styleUrls: ['./edit-sweet.component.scss']
})
export class EditSweetComponent implements OnInit {
  @Output() disableEditing: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Input() sweet!: Partial<ISweet>;
  @Input() sweetTotalPrices: ISweetTotalPrices = {
    CurrentTotalPrice: 0,
    Profit: 0
  };

  public products: IProduct[] = [];
  public sweetProducts: IProduct[] = [];
  public selectedProducts: ISweetProduct[] = [];

  @Input() editSweetForm: FormGroup = new FormGroup({});

  public unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private calculationService: CalculationService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.requestProducts();
    this.initForm();
    this.sweetTotalPrices.CurrentTotalPrice = this.sweet.TotalPrice!;
    this.sweetTotalPrices.Profit = this.sweet.Profit!;
    this.calculateSweetTotalPrice();
  }

  private requestProducts(): void {
    this.Request.GetItems<IProduct[]>('products')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (products: IProduct[] | null) => {
          this.products = products ? this.Request.MakeArrayFromFirebaseResponse(products) : [];
          this.selectedProducts = this.sweet.Products!;

          for (const selectedProduct of this.selectedProducts) {
            this.sweetProducts.push(this.products.find(product => product.ID === selectedProduct.ID)!);
          }

        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Something Went Wrong');
        }
      });
  }

  public onFileChange(event: any) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.editSweetForm.controls['Image'].setValue(reader.result as string);
        this.editSweetForm.controls['Image'].markAsDirty();
      };

    }
  }

  public imageDropped(Image: any): void {
    this.editSweetForm.controls['Image'].setValue(Image);
    this.editSweetForm.controls['Image'].markAsDirty();
  }

  public imageClear(): void {
    this.editSweetForm.controls['Image'].setValue(null);
    this.editSweetForm.controls['Image'].markAsDirty();
    this.editSweetForm.controls['Image'].markAsTouched();
  }

  private initForm(): void {
    this.editSweetForm.patchValue(this.sweet);
  }

  public createItem(evn: any): void {
    const items: FormArray = this.editSweetForm.controls['Products'] as FormArray;

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
    this.editSweetForm.controls['Products'].markAsDirty();

    return new FormGroup<ISweetQuantityForm>({
      ID: new FormControl(itemValue.ID),
      Name: new FormControl(itemValue.Name),
      Quantity: new FormControl(1, Validators.required)
    });
  }

  public productsAsFormArray(): FormArray {
    return this.editSweetForm.controls['Products'] as FormArray;
  }

  public getFormGroup(i: number): FormGroup {
    return this.productsAsFormArray().controls[i] as FormGroup;
  }

  public removeFormGroup(i: number): void {
    this.editSweetForm.controls['Products'].markAsDirty();
    this.editSweetForm.controls['Products'].markAsTouched();
    const items: FormArray = this.productsAsFormArray();
    items.removeAt(i);

    const oldSelected: IProduct[] = [...this.sweetProducts];
    oldSelected.splice(i, 1);
    this.sweetProducts = oldSelected;

    this.calculateSweetTotalPrice();
  }

  private calculateSweetTotalPrice(): void {
    setTimeout(() => {
      this.calculationService.CalculateSweetTotalPrice(this.editSweetForm.value, this.sweetTotalPrices);
    }, 500)
  }

  public sweetSelectionChangedWithInput(evn: any): void {
    this.editSweetForm.controls['Products'].markAsDirty();
    if (evn.hasOwnProperty('value')) {
      this.calculateSweetTotalPrice();
    } else if (evn.key && (evn.key.match(/[0-9]/) || evn.key === 'Backspace' || evn.key === 'Delete')) {
      this.calculateSweetTotalPrice();
    }
  }
}
