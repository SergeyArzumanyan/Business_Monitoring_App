import { Injectable } from '@angular/core';
import { Database, ref, set } from "@angular/fire/database";

import { ISweet } from "@Interfaces/sweet.interface";
import { IProductForSending } from "@Interfaces/product.interface";

@Injectable({
  providedIn: 'root'
})

export class SendingDataService {


  constructor(
    private db: Database,
    ) {}


  public createSweet(sweet: ISweet): void {
    set(ref(this.db , `sweets/${+(new Date())}`), sweet)
      .then(() => {
        console.log('successfully sent.')
      })
      .catch(() => {
        console.log('FAILED to save sweet.')
      });
  }

  public createProduct(product: IProductForSending): void {
    set(ref(this.db, `products/${+(new Date())}`), product)
      .then(() => {
        console.log('successfully sent.')
      })
      .catch(() => {
        console.log('FAILED to save product.')
      });
  }

}
