import { Injectable } from '@angular/core';
import { MessageService } from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) {}

  public showToast(type: string, heading: string, message: string) {
    this.messageService.add({ severity: type, summary: heading, detail: message })
  }

}
