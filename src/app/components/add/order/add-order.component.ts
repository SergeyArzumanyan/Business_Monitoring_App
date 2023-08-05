import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { take, zip } from "rxjs";

import {
  CalculationService, EditService,
  RequestsService, SendingDataService,
  ToastService,
} from "@Core/services";
import {
  IClient,
  ISweet,
  IAddOrderForm,
  IOrderSweet,
  IOrderSweetQuantityForm,
  IOrder,
} from "@Core/interfaces";

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {

  public addOrderForm: FormGroup<IAddOrderForm> = new FormGroup<IAddOrderForm>({
    Client: new FormControl(null, Validators.required),
    Sweets: this.formBuilder.array([], Validators.required),
    Address: new FormControl(null, Validators.required),
    DeliveryPrice: new FormControl(null, Validators.required),
    TotalPrices: new FormControl({
      OrderTotalPrice: 0,
      SweetsTotalPrice: 0,
    })
  });

  public submitted: boolean = false;

  public clients: IClient[] = [];

  public sweets: IOrderSweet[] = [];
  public selectedSweets: string[] = [];
  public selectedClient: IClient[] = [];

  constructor(
    private Request: RequestsService,
    private Send: SendingDataService,
    private Edition: EditService,
    private formBuilder: FormBuilder,
    private calculationService: CalculationService,
    private toastService: ToastService,
  ) {
  }

  ngOnInit(): void {
    this.getNecessaryItems();
  }

  private getNecessaryItems(): void {
    zip([
      this.Request.GetItems<IClient[]>('clients'),
      this.Request.GetItems<ISweet[]>('sweets')
    ])
      .pipe(take(1))
      .subscribe({
        next: (res: [IClient[] | null, ISweet[] | null]) => {
          this.clients = res[0] ? this.Request.MakeArrayFromFirebaseResponse(res[0]) : [];
          this.sweets = res[1] ? this.Request.MakeArrayFromFirebaseResponse(res[1]) : [];
        },
        error: () => {
          this.toastService.showToast('error', 'Error', 'Failed To Get Necessary Data');
        }
      });
  }

  public setClientValue(evn: any): void {
    if (evn.value[0] && evn.value[0]['Name']) {
      this.addOrderForm.controls['Client'].setValue(evn.value[0]['Name']);
    } else {
      this.addOrderForm.controls['Client'].setValue(null);
    }
  }

  public createItem(evn: any): void {
    const sweets: FormArray = this.addOrderForm.controls['Sweets'] as FormArray;

    if (evn.itemValue) {
      const idx = sweets.controls.findIndex((sweet: AbstractControl) =>
        sweet.value.ID === evn.itemValue.ID);
      if (idx === -1) {
        sweets.push(this.createFormGroup(evn.itemValue))
      } else {
        sweets.removeAt(idx);
      }
    } else {
      sweets.clear();
    }

    this.calculateOrderPrice();
  }

  public createFormGroup(itemValue: any): FormGroup {
    return new FormGroup<IOrderSweetQuantityForm>({
      ID: new FormControl(itemValue.ID),
      Name: new FormControl(itemValue.Name),
      Products: new FormControl(itemValue.Products),
      Quantity: new FormControl(1, Validators.required)
    });
  }

  public sweetsAsFormArray(): FormArray {
    return this.addOrderForm.controls['Sweets'] as FormArray;
  }

  public getFormGroup(i: number): FormGroup {
    return this.sweetsAsFormArray().controls[i] as FormGroup;
  }

  public removeFormGroup(i: number): void {
    const items: FormArray = this.sweetsAsFormArray();
    items.removeAt(i);

    const oldSelected: string[] = [...this.selectedSweets];
    oldSelected.splice(i, 1);
    this.selectedSweets = oldSelected;

    this.calculateOrderPrice();
  }

  public onAdd(): void {
    setTimeout(() => {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
      this.submitted = true;

      if (this.addOrderForm.valid) {
        this.Send.CreateItem<IOrder>('orders', 'Order', this.addOrderForm.value);
        this.attachOrderToClient();
        this.addOrderForm.controls.Sweets.clear();
        this.addOrderForm.reset();
        this.selectedSweets = [];
        this.selectedClient = [];
        this.resetOrderTotalPrice();
        this.submitted = false;
      } else {
        this.addOrderForm.markAllAsTouched();
      }
    }, 500);
  }

  private attachOrderToClient(): void {
    const client: IClient = this.selectedClient[0];
    if (!client.Orders?.Entities || client.Orders.Entities?.length === 0) {
      client.Orders = {
        Entities: [this.addOrderForm.value],
        Count: 1
      };
    } else {
      client.Orders.Entities!.push(this.addOrderForm.value);
      client.Orders.Count!++;
    }
    this.Edition.UpdateItemByFirebaseKey(
      'clients',
      this.selectedClient[0],
      this.selectedClient[0].ID!.toString()
    );
  }

  public orderSelectionChangedWithInput(evn: any): void {
    if (evn.hasOwnProperty('value')) {
      this.calculateOrderPrice();
    } else if (evn.key && (evn.key.match(/[0-9]/) || evn.key === 'Backspace' || evn.key === 'Delete')) {
      this.calculateOrderPrice();
    }
  }

  private calculateOrderPrice(): void {
    setTimeout(() => {
      this.calculationService.CalculateOrderPrice(this.addOrderForm.value);
    }, 500);
  }

  private resetOrderTotalPrice(): void {
    this.addOrderForm.controls.TotalPrices.setValue({
      OrderTotalPrice: 0,
      SweetsTotalPrice: 0
    });
  }
}
