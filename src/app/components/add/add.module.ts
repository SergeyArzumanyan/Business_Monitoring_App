import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { AddRoutingModule } from "@Components/add/add-routing.module";

import {
  AddComponent,
  AddSweetComponent,
  AddProductComponent,
} from "@Components/add";

import { SharedModule } from "@Shared/shared.module";


@NgModule({
  declarations: [
    AddProductComponent,
    AddSweetComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class AddModule { }
