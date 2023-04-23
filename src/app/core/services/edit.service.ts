import { Injectable } from '@angular/core';
import { Database, ref, set } from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class EditService {

  constructor(private db: Database) {}

  public editItemBId(itemsUrl: string, id: number, newItemData: any): void {
    set(ref(this.db, `${itemsUrl}/${id}`), newItemData);
  }

}
