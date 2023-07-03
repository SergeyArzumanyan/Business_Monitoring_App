import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ProductsRoutingModule } from "./products-routing.module";

import { ProductsComponent } from "@Components/products/products.component";
import { SharedModule } from "@Shared/shared.module";


@NgModule({
  declarations: [
    ProductsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ProductsRoutingModule,
  ]
})
export class ProductsModule {
}
