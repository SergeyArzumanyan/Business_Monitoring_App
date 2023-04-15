import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddSweetComponent } from "@components/add/sweet";
import { AddProductComponent } from "@components/add/product";
import { AddComponent } from "@components/add/add.component";

const routes: Routes = [
  {
    path: '',
    component: AddComponent
  },
  {
    path: 'sweet',
    component: AddSweetComponent
  },
  {
    path: 'product',
    component: AddProductComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddRoutingModule { }
