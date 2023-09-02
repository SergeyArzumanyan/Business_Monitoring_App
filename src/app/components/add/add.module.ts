import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AddRoutingModule } from "@Components/add/add-routing.module";

import {
  AddComponent,
  AddPrimaryItemComponent,
  AddSecondaryItemComponent,
  AddClientComponent,
  AddOrderComponent,
  AddConsumptionComponent,
} from "@Components/add";

import { SharedModule } from "@Shared/shared.module";
import { TranslateModule } from "@ngx-translate/core";


@NgModule({
  declarations: [
    AddSecondaryItemComponent,
    AddPrimaryItemComponent,
    AddComponent,
    AddClientComponent,
    AddOrderComponent,
    AddConsumptionComponent,
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    TranslateModule,
  ]
})
export class AddModule { }
