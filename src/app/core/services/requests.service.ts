import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

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

  public getSweet(ID: number | null): any {
    return this.db.list<ISweet>('/sweets', ref => ref.orderByChild('ID').equalTo(ID)).valueChanges()
  }

  public getProducts(): Observable<IProduct[] | null> {
    const starCountRef: AngularFireObject<IProduct[]> = this.db.object('/products');
      return starCountRef.valueChanges();
  }

  public makeArray(data: any): any[] {
    return Array.from(Object.values(data));
  }
}
