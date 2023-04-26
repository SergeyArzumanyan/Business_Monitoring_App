import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { AngularFireDatabase } from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class EditService {

  constructor(private db: AngularFireDatabase) {}

  public editItem(itemsUrl: string, key: string, value: string): Observable<any> {
    return this.db.list(`/${itemsUrl}`, ref => ref.orderByChild(key).equalTo(value)).snapshotChanges();
  }
}
