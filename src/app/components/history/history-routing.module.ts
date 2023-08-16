import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  OrdersComponent,
  ConsumptionsComponent,
  ProfitComponent
} from "@Components/history";



const routes: Routes = [
  {
    path: "orders",
    component: OrdersComponent,
  },
  {
    path: "consumptions",
    component: ConsumptionsComponent,
  },
  {
    path: "profit",
    component: ProfitComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoryRoutingModule {}
