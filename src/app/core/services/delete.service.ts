import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(private db: AngularFireDatabase) {}

  public deleteItemById(itemsUrl: string, name: string): void {
    this.db.database.ref(`${itemsUrl}/` + name).remove()
      .then(() => {
        console.log('Removed.')});
  }

}
