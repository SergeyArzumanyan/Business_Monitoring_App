import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { AngularFireDatabase, AngularFireObject } from "@angular/fire/compat/database";

import { ISweet } from "@Interfaces/sweet.interface";
import { IProduct } from "@Interfaces/product.interface";

@Injectable({
  providedIn: 'root'
})

export class RequestsService {

  constructor(private db: AngularFireDatabase) {}

  public getSweets(): Observable<ISweet[] | null> {
    const starCountRef: AngularFireObject<ISweet[]> = this.db.object('/sweets');
    return starCountRef.valueChanges();
  }

  public getSweet(name: string | null): any {
      // const starCountRef: AngularFireObject<ISweet> = this.db.object(`sweets/${id}`);
      // return starCountRef.valueChanges();
    const itemsRef = this.db.list(
      'items',
        ref => ref.orderByChild('name').equalTo(name)
    );
  return itemsRef.snapshotChanges();


  }

  public getProducts(): Observable<IProduct[] | null> {
    const starCountRef: AngularFireObject<IProduct[]> = this.db.object('/products');
      return starCountRef.valueChanges();
  }

  public makeArray(data: any): any[] {
    return Array.from(Object.values(data));
  }
}
