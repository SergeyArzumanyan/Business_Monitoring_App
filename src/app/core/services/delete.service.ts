import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

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

  public RemoveItemByFirebaseKey(ItemsEndPoint: string, ItemFirebaseKey: string, ItemName: string): Promise<any> {
    return this.db.object(`/${ItemsEndPoint}/${ItemFirebaseKey}`).remove()
      .then(() => {
        if (!this.router.url.includes('sweets')) {
          this.toastService.showToast('success', 'Done', `${ItemName} Deleted Successfully.`);
        }
      })
      .catch(() => {
        this.toastService.showToast('error', 'Error', 'Something Went Wrong.');
      });
  }
}
