import { Component } from '@angular/core';

import { Configs } from '@Core/configs';
import { TranslateService } from "@ngx-translate/core";
import { TitleService } from "@Core/services";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {

  public Configs = Configs;

  constructor(
    private titleService: TitleService,
    public translateService: TranslateService
  ) {
    this.titleService.setTitle(Configs.AppMainTitle, this.translateService.instant('Add'));
  }

}
