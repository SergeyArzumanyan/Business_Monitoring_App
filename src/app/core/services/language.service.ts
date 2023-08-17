import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

import {MenuItem} from "primeng/api";

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  public selectedLanguage$: BehaviorSubject<string> = new BehaviorSubject<string>('En');

  public languagesList: MenuItem[] = [
    {
      label: this.selectedLanguage$.getValue(),
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


  constructor() {
    this.CheckCurrentLanguage();
  }

  private CheckCurrentLanguage(): void {
    if (localStorage.getItem('lang')) {
      this.selectedLanguage$.next(localStorage.getItem('lang')!);
    } else {
      this.selectedLanguage$.next('En');
      localStorage.setItem('lang', 'En');
    }
  }

  private SetSelectedLanguage(e: any): any {
    e.originalEvent.stopPropagation();
    this.languagesList[0]['label'] = e.item.label;
    this.selectedLanguage$.next(e.item.label);
    localStorage.setItem('lang', e.item.label)
  }
}
