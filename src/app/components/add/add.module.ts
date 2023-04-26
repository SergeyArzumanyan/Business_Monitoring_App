import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { AddProductComponent } from "@components/add/product";
import { ReactiveFormsModule } from "@angular/forms";
import { AddSweetComponent } from "@components/add/sweet";
import { AddComponent } from './add.component';
import { DragDirective } from "../../core/directives/drag.directive";

import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { MultiSelectModule } from "primeng/multiselect";
import { KeyFilterModule } from "primeng/keyfilter";


@NgModule({
  declarations: [
    AddProductComponent,
    AddSweetComponent,
    AddComponent,
    DragDirective,
  ],
  exports: [
    DragDirective
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    KeyFilterModule,
    ReactiveFormsModule,
  ]
})
export class AddModule { }
