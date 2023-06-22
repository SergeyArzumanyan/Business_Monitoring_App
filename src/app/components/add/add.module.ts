import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { AddRoutingModule } from "@Components/add/add-routing.module";

import {
  AddComponent,
  AddSweetComponent,
  AddProductComponent,
  AddClientComponent,
} from "@Components/add";

import { SharedModule } from "@Shared/shared.module";


@NgModule({
  declarations: [
    AddProductComponent,
    AddSweetComponent,
    AddComponent,
    AddClientComponent,
  ],
    imports: [
        CommonModule,
        AddRoutingModule,
        ReactiveFormsModule,
        SharedModule,
    ]
})
export class AddModule { }
