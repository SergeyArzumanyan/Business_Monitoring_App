import { Injectable } from '@angular/core';
import { Database, ref, set } from "@angular/fire/database";
import { RequestsService } from "@Services/requests.service";
import { HttpClient } from "@angular/common/http";
import { IProduct } from "@Interfaces/product.interface";
import { ISweet } from "@Interfaces/sweet.interface";

@Injectable({
  providedIn: 'root'
})

export class SendingDataService {


  constructor(
    private db: Database,
    private Request: RequestsService,
    private Send: HttpClient
    ) {}


  public saveSweet(sweet: ISweet): void {
    set(ref(this.db , `sweets/${+(new Date())}`), sweet)
      .then(() => {
        console.log('successfully sent.')
      })
      .catch(() => {
        console.log('FAILED to save sweet.')
      });
  }

  public saveProduct(product: IProduct): void {
    set(ref(this.db, `products/${+(new Date())}`), product)
      .then(() => {
        console.log('successfully sent.')
      })
      .catch(() => {
        console.log('FAILED to save product.')
      });
  }

}
