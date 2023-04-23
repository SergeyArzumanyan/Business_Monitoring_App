import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SweetsComponent } from "@components/sweets/sweets.component";
import { SweetComponent } from "@components/sweets/sweet";

const routes: Routes = [
  {
    path: "",
    component: SweetsComponent
  },
  {
    path: ":sweet-id",
    component: SweetComponent
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
