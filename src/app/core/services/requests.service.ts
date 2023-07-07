import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

import { AngularFireDatabase, AngularFireObject } from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})

export class RequestsService {

  constructor(private db: AngularFireDatabase) {}

  public GetItemFirebaseKey(ItemsEndPoint: string, FirebaseKey: string, ItemValue: any): Observable<any> {
    return this.db.list(`/${ItemsEndPoint}`,
      FirebaseDBReference =>
        FirebaseDBReference.orderByChild(FirebaseKey).equalTo(ItemValue))
      .snapshotChanges();
  }

  public GetItemByObjectKey(ItemEndPoint: string, ItemKey: string, ItemValue: any): Observable<any> {
    return this.db.list(`/${ItemEndPoint}`,
      FirebaseDBReference =>
        FirebaseDBReference.orderByChild(ItemKey).equalTo(ItemValue))
      .valueChanges();
  }

  public GetItems<T>(ItemsEndPoint: string): Observable<T | null> {
    const starCountRef: AngularFireObject<T | null> = this.db.object(`/${ItemsEndPoint}`);
    return starCountRef.valueChanges();
  }

  public MakeArrayFromFirebaseResponse(data: any): any[] {
    return Array.from(Object.values(data));
  }
}
