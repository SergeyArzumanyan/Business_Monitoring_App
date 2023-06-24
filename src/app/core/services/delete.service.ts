import { Injectable } from '@angular/core';
import { Observable, take } from "rxjs";

import { AngularFireDatabase } from "@angular/fire/compat/database";
import { ToastService } from "@Core/services/toast.service";

@Injectable({
  providedIn: 'root'
})
export class DeleteService {

  constructor(
    private db: AngularFireDatabase,
    private toastService: ToastService,
  ) {}

  public deleteItem(items: string, key: string, value: number): Observable<any> {
    return this.db.list(`/${items}`, ref => ref.orderByChild(key).equalTo(value))
      .snapshotChanges()
      .pipe(take(1))
  }

  public removeItem(items: string, key: string, item: string): void {
    this.db.object(`/${items}/${key}`).remove()
      .then(() => {
        this.toastService.showToast('success', 'Done', `${item} Deleted Successfully.`);
      })
      .catch(() => {
        this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
      });
  }
}
