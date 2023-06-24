import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { AngularFireDatabase } from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class EditService {

  constructor(private db: AngularFireDatabase) {}

  public editItem(itemsUrl: string, key: string, value: number): Observable<any> {
    return this.db.list(`/${itemsUrl}`, ref => ref.orderByChild(key).equalTo(value)).snapshotChanges();
  }

  public updateCurrentItem(items: string, newValue: any, itemsKey: string): Promise<void> {
    return this.db.list(`/${items}`).update(itemsKey, newValue);
  }
}
