import { Injectable } from '@angular/core';
import { take } from "rxjs";

import { AngularFireDatabase } from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(private db: AngularFireDatabase) {}

  public deleteItem(items: string, key: string, value: number): any {
    return this.db.list(`/${items}`, ref => ref.orderByChild(key).equalTo(value))
      .snapshotChanges()
      .pipe(take(1))
  }
}
