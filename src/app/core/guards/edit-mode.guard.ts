import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

import { ConfirmationService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class EditModeGuard implements CanDeactivate<any> {
  constructor(private confirmationService: ConfirmationService) {}

  canDeactivate(component: any): Observable<boolean> | Promise<boolean> | boolean {
    if (component.isEditMode || component.isFormDirty) {
      return this.showEditModeLeaveMessage();
    }

    return true;
  }

  private showEditModeLeaveMessage(): any {

    return new Observable<boolean>((observer): void => {
      this.confirmationService.confirm({
        message: 'Are you sure you want to discard your changes ?',
        header: 'Discard Changes ?',
        icon: 'pi pi-sign-out icon-big',
        accept: (): void => {
          observer.next(true); // Allow deactivation
          observer.complete();
        },
        reject: (): void => {
          observer.next(false); // Prevent deactivation
          observer.complete();
        }
      });
    })
  }

}
