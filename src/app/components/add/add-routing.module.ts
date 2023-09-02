import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  AddComponent,
  AddSecondaryItemComponent,
  AddPrimaryItemComponent,
  AddClientComponent,
  AddOrderComponent,
  AddConsumptionComponent,
} from "@Components/add";
import { Configs } from "@Core/configs";

const routes: Routes = [
  {
    path: '',
    component: AddComponent
  },
  {
    path: Configs.PrimaryItemAddRoute,
    component: AddPrimaryItemComponent
  },
  {
    path: Configs.SecondaryItemAddRoute,
    component: AddSecondaryItemComponent
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
    path: 'consumption',
    component: AddConsumptionComponent
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
