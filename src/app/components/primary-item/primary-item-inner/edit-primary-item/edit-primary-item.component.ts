import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { Subject, takeUntil } from "rxjs";

import {
  CalculationService,
  RequestsService,
  ToastService
} from "@Core/services";
import {
  ISecondaryItem,
  IPrimaryItem,
  IPrimaryItemPart,
  IPrimaryItemQuantityForm,
  IPrimaryItemTotalPrices
} from "@Core/interfaces";
import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Component({
  selector: 'app-edit-primary-item',
  templateUrl: './edit-primary-item.component.html',
  styleUrls: ['./edit-primary-item.component.scss']
})
export class EditPrimaryItemComponent implements OnInit {
  @Output() disableEditing: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Input() primaryItem!: Partial<IPrimaryItem>;
  @Input() primaryItemTotalPrices: IPrimaryItemTotalPrices = {
    CurrentTotalPrice: 0,
    Profit: 0
  };

  public secondaryItems: ISecondaryItem[] = [];
  public primaryItemParts: ISecondaryItem[] = [];
  public selectedSecondaryItemss: IPrimaryItemPart[] = [];

  @Input() editPrimaryItemForm: FormGroup = new FormGroup({});

  public unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private Request: RequestsService,
    private calculationService: CalculationService,
    private toastService: ToastService,
    public translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.requestSecondaryItems();
    this.initForm();
    this.primaryItemTotalPrices.CurrentTotalPrice = this.primaryItem.TotalPrice!;
    this.primaryItemTotalPrices.Profit = this.primaryItem.Profit!;
    this.calculatePrimaryItemTotalPrice();
  }

  private requestSecondaryItems(): void {
    this.Request.GetItems<ISecondaryItem[]>(Configs.SecondaryItemEndPoint)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (secondaryItemsRes: ISecondaryItem[] | null) => {
          this.secondaryItems = secondaryItemsRes ? this.Request.MakeArrayFromFirebaseResponse(secondaryItemsRes) : [];
          this.selectedSecondaryItemss = this.primaryItem.SecondaryItems!;

          for (const selectedSecondaryItem of this.selectedSecondaryItemss) {
            this.primaryItemParts.push(this.secondaryItems
              .find(secondaryItem => secondaryItem.ID === selectedSecondaryItem.ID)!);
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
        this.editPrimaryItemForm.controls['Image'].setValue(reader.result as string);
        this.editPrimaryItemForm.controls['Image'].markAsDirty();
      };

    }
  }

  public imageDropped(Image: any): void {
    this.editPrimaryItemForm.controls['Image'].setValue(Image);
    this.editPrimaryItemForm.controls['Image'].markAsDirty();
  }

  public imageClear(): void {
    this.editPrimaryItemForm.controls['Image'].setValue(null);
    this.editPrimaryItemForm.controls['Image'].markAsDirty();
    this.editPrimaryItemForm.controls['Image'].markAsTouched();
  }

  private initForm(): void {
    this.editPrimaryItemForm.patchValue(this.primaryItem);
  }

  public createItem(evn: any): void {
    const items: FormArray = this.editPrimaryItemForm.controls['SecondaryItems'] as FormArray;

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
    this.editPrimaryItemForm.controls['SecondaryItems'].markAsDirty();

    return new FormGroup<IPrimaryItemQuantityForm>({
      ID: new FormControl(itemValue.ID),
      Name: new FormControl(itemValue.Name),
      Quantity: new FormControl(1, Validators.required)
    });
  }

  public secondaryItemsAsFormArray(): FormArray {
    return this.editPrimaryItemForm.controls['SecondaryItems'] as FormArray;
  }

  public getFormGroup(i: number): FormGroup {
    return this.secondaryItemsAsFormArray().controls[i] as FormGroup;
  }

  public removeFormGroup(i: number): void {
    this.editPrimaryItemForm.controls['SecondaryItems'].markAsDirty();
    this.editPrimaryItemForm.controls['SecondaryItems'].markAsTouched();
    const items: FormArray = this.secondaryItemsAsFormArray();
    items.removeAt(i);

    const oldSelected: ISecondaryItem[] = [...this.primaryItemParts];
    oldSelected.splice(i, 1);
    this.primaryItemParts = oldSelected;

    this.calculatePrimaryItemTotalPrice();
  }

  private calculatePrimaryItemTotalPrice(): void {
    setTimeout(() => {
      this.calculationService.CalculatePrimaryItemTotalPrice(this.editPrimaryItemForm.value, this.primaryItemTotalPrices);
    }, 500)
  }

  public primaryItemSelectionChangedWithInput(evn: any): void {
    this.editPrimaryItemForm.controls['SecondaryItems'].markAsDirty();
    if (evn.hasOwnProperty('value')) {
      this.calculatePrimaryItemTotalPrice();
    } else if (evn.key && (evn.key.match(/[0-9]/) || evn.key === 'Backspace' || evn.key === 'Delete')) {
      this.calculatePrimaryItemTotalPrice();
    }
  }
}
