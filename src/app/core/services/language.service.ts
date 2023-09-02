import { Injectable } from '@angular/core';

import { MenuItem } from "primeng/api";

import { TranslateService } from "@ngx-translate/core";
import { Configs } from "@Core/configs";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public languagesList: MenuItem[] = [
    {
      label: localStorage.getItem('lang') ? localStorage.getItem('lang')! : 'En',
      icon: 'icon-md ' + Configs.LanguagesIcon,
      command: (e) => e.originalEvent.stopPropagation(),
      items: [
        {
          label: 'En',
          command: (e) => this.SetSelectedLanguage(e)
        },
        {
          label: 'Arm',
          command: (e) => this.SetSelectedLanguage(e)
        }
      ]
    }
  ]


  constructor(private translateService: TranslateService) {
    this.CheckCurrentLanguage();
  }

  private CheckCurrentLanguage(): void {
    if (localStorage.getItem('lang')) {
      this.translateService.use(localStorage.getItem('lang')!);
    } else {
      this.languagesList[0]['label'] = 'En'
      localStorage.setItem('lang', 'En');
      this.translateService.use('En');
    }
  }


  private SetSelectedLanguage(e: any): any {
    e.originalEvent.stopPropagation();
    this.languagesList[0]['label'] = e.item.label;
    localStorage.setItem('lang', e.item.label)
    this.translateService.use(e.item.label);
  }
}
