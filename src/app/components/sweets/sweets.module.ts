import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SweetsRoutingModule } from "@Components/sweets/sweets-routing.module";
import {
  SweetComponent,
  SweetsComponent
} from "@Components/sweets";
import { EditSweetComponent } from '@Components/sweets/sweet';

import { SharedModule } from "@Shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  declarations: [
    SweetsComponent,
    SweetComponent,
    EditSweetComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SweetsRoutingModule,
        SharedModule,
        TranslateModule,
    ]
})
export class SweetsModule {
}
