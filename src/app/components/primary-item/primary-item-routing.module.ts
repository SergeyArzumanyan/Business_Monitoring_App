import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PrimaryItemComponent, PrimaryItemInnerComponent } from "@Components/primary-item";
import { EditModeGuard } from "@Core/guards";

const routes: Routes = [
  {
    path: "",
    component: PrimaryItemComponent
  },
  {
    path: ":primary-item-inner-id",
    component: PrimaryItemInnerComponent,
    canDeactivate: [EditModeGuard]
  },
  {
    path: "**",
    redirectTo: "",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrimaryItemRoutingModule { }
