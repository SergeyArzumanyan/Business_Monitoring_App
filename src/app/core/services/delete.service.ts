import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
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
    private router: Router,
  ) {}

  public deleteItem(items: string, key: string, value: number): Observable<any> {
    return this.db.list(`/${items}`, ref => ref.orderByChild(key).equalTo(value))
      .snapshotChanges()
      .pipe(take(1))
  }

  public removeItem(items: string, key: string, item: string): void {
    this.db.object(`/${items}/${key}`).remove()
      .then(() => {
        if (!this.router.url.includes('sweets')) {
          this.toastService.showToast('success', 'Done', `${item} Deleted Successfully.`);
        }
      })
      .catch(() => {
        this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
      });
  }
}
