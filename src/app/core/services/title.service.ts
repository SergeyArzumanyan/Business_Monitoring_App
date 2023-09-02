import { Injectable } from '@angular/core';

import { Title } from "@angular/platform-browser";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private titleService: Title) {}

  public setTitle(title: string, description?: string): void {
    if (!description) {
      this.titleService.setTitle(title);
      return;
    }

    this.titleService.setTitle(`${title} - ${description}`);
  }
}
