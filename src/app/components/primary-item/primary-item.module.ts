import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { PrimaryItemRoutingModule } from "./primary-item-routing.module";

import {
  PrimaryItemInnerComponent,
  PrimaryItemComponent,
  EditPrimaryItemComponent
} from "app/components/primary-item";

import { SharedModule } from "@Shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  declarations: [
    PrimaryItemComponent,
    PrimaryItemInnerComponent,
    EditPrimaryItemComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PrimaryItemRoutingModule,
        SharedModule,
        TranslateModule,
    ]
})
export class PrimaryItemModule {
}
