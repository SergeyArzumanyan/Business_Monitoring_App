import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AddComponent,
  AddProductComponent,
  AddSweetComponent,
  AddClientComponent,
  AddOrderComponent,
} from "@Components/add";

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
    path: 'client',
    component: AddClientComponent
  },
  {
    path: 'order',
    component: AddOrderComponent
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
