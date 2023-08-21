import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { AngularFireDatabase } from "@angular/fire/compat/database";

import { ToastService } from "@Core/services/toast.service";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})

export class DeleteService {

  constructor(
    private db: AngularFireDatabase,
    private toastService: ToastService,
    private router: Router,
    public translateService: TranslateService
  ) {}

  public RemoveItemByFirebaseKey(ItemsEndPoint: string, ItemFirebaseKey: string, ItemName: string): Promise<any> {
    return this.db.object(`/${ItemsEndPoint}/${ItemFirebaseKey}`).remove()
      .then(() => {
        this.toastService.showToast(
          'success',
          this.translateService.instant('Done'),
          this.translateService.instant('DeletedItemSuccessfully',
            {key: this.translateService.instant(ItemName)})
          );
      })
      .catch(() => {
        this.toastService.showToast(
          'error',
          this.translateService.instant('Error'),
          this.translateService.instant('FailedToDeleteItem',
            {key: this.translateService.instant(ItemName)})
        );
      });
  }
}
