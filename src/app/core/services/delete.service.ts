import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { map, switchMap, take } from "rxjs";
import { ISweet } from "@Interfaces/sweet.interface";

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(private db: AngularFireDatabase) {}

  public deleteItemById(items: string, key: string, value: string): any {
    // this.db.list<ISweet>('/sweets', ref => ref.orderByChild('Name').equalTo(Name)).valueChanges()
    return this.db.list<ISweet>('/sweets', ref => ref.orderByChild('Name').equalTo(value))
      .snapshotChanges()
      .pipe(take(1))
  }
}
