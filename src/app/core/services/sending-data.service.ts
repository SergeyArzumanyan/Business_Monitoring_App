import { Injectable } from '@angular/core';
import { Database, ref, set } from "@angular/fire/database";

import { ToastService } from "@Core/services";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})

export class SendingDataService {


  constructor(
    private db: Database,
    private toastService: ToastService,
    public translateService: TranslateService
  ) {}

  public CreateItem<T>(ItemEndPoint: string, ItemName: string, ItemToCreate: T | Partial<T>): void {
    set(ref(this.db , `${ItemEndPoint}/${+(new Date())}`), ItemToCreate)
      .then((): void => {
        this.toastService.showToast(
          'success',
          this.translateService.instant('Done'),
          this.translateService.instant('CreatedItemSuccessfully',
            {key: this.translateService.instant(ItemName)})
        );
      })
      .catch((): void => {
        this.toastService.showToast(
          'error',
          this.translateService.instant('Error'),
          this.translateService.instant('FailedToCreateItem',
            {key: this.translateService.instant(ItemName)})
        );
      });
  }

}
