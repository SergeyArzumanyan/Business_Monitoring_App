import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { AddRoutingModule } from './add-routing.module';
import { AddProductComponent } from "@components/add/product";
import { AddSweetComponent } from "@components/add/sweet";
import { AddComponent } from './add.component';
import { InputTextModule } from "primeng/inputtext";
import { InputNumberModule } from "primeng/inputnumber";
import { DragDirective } from "../../core/directives/drag.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MultiSelectModule } from "primeng/multiselect";
import { KeyFilterModule } from "primeng/keyfilter";


@NgModule({
  declarations: [
    AddProductComponent,
    AddSweetComponent,
    AddComponent,
    DragDirective
  ],
  imports: [
    CommonModule,
    AddRoutingModule,
    InputTextModule,
    InputNumberModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    MultiSelectModule,
    KeyFilterModule,
    FormsModule,
  ]
})
export class AddModule { }
