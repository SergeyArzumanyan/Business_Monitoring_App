import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SweetsComponent, SweetComponent } from "@Components/sweets";
import { EditModeGuard } from "@Core/guards";

const routes: Routes = [
  {
    path: "",
    component: SweetsComponent
  },
  {
    path: ":sweet-id",
    component: SweetComponent,
    canDeactivate: [EditModeGuard]
  },
  {
    path: "**",
    redirectTo: "sweets",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SweetsRoutingModule { }
