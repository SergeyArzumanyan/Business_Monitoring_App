import { Injectable } from '@angular/core';
import { Database, ref, set } from "@angular/fire/database";

import { ToastService } from "@Core/services";

@Injectable({
  providedIn: 'root'
})

export class SendingDataService {


  constructor(
    private db: Database,
    private toastService: ToastService
  ) {}

  public CreateItem<T>(ItemEndPoint: string, ItemName: string, ItemToCreate: T | Partial<T>): void {
    set(ref(this.db , `${ItemEndPoint}/${+(new Date())}`), ItemToCreate)
      .then((): void => {
        this.toastService.showToast('success', 'Done', `${ItemName} Created Successfully.`);
      })
      .catch((): void => {
        this.toastService.showToast('error', 'Error', `Failed To Create ${ItemName}.`);
      });
  }

}
