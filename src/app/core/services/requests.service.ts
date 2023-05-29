import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { AngularFireDatabase, AngularFireObject } from "@angular/fire/compat/database";

import {
  ISweet,
  IProduct
} from "@Core/interfaces";

@Injectable({
  providedIn: 'root'
})

export class RequestsService {

  constructor(private db: AngularFireDatabase) {}

  public getSweets(): Observable<ISweet[] | null> {
    const starCountRef: AngularFireObject<ISweet[]> = this.db.object('/sweets');
    return starCountRef.valueChanges();
  }

  public getSweet(ID: number | null): Observable<ISweet[]> {
    return this.db.list<ISweet>('/sweets', ref => ref.orderByChild('ID').equalTo(ID)).valueChanges()
  }

  public getProducts(): Observable<IProduct[] | null> {
    const starCountRef: AngularFireObject<IProduct[]> = this.db.object('/products');
      return starCountRef.valueChanges();
  }

  public getProductsBasedOnSweet(ID: number | null): Observable<IProduct[]> {
    return this.db.list<IProduct>('/products', ref => ref.orderByChild('ID').equalTo(ID)).valueChanges()
  }

  public makeArray(data: any): any[] {
    return Array.from(Object.values(data));
  }
}
