import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from "@Components/products";

const routes: Routes = [
  {
    path: "",
    component: ProductsComponent
  },
  {
    path: "**",
    redirectTo: "products",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
