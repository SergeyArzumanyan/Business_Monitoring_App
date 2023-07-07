import { Injectable } from '@angular/core';

import { AngularFireDatabase } from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})

export class EditService {

  constructor(private db: AngularFireDatabase) {}

  public UpdateItemByFirebaseKey(ItemsEndPoint: string, ItemNewValue: any, ItemFirebaseKey: string): Promise<void> {
    return this.db.list(`/${ItemsEndPoint}`).update(ItemFirebaseKey, ItemNewValue);
  }
}
