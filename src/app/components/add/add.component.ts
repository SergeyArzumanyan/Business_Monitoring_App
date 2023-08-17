import { Component } from '@angular/core';

import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent {

  constructor(public translateService: TranslateService) {}

}
