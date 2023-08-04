import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AddRoutingModule } from "@Components/add/add-routing.module";

import {
  AddComponent,
  AddSweetComponent,
  AddProductComponent,
  AddClientComponent,
  AddOrderComponent,
} from "@Components/add";

import { SharedModule } from "@Shared/shared.module";


@NgModule({
  declarations: [
    AddProductComponent,
    AddSweetComponent,
    AddComponent,
    AddClientComponent,
    AddOrderComponent,
  ],
    imports: [
        CommonModule,
        AddRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        FormsModule,
    ]
})
export class AddModule { }
