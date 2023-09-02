import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SecondaryItemComponent } from "app/components/secondary-item";

const routes: Routes = [
  {
    path: "",
    component: SecondaryItemComponent
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
export class SecondaryItemRoutingModule { }
