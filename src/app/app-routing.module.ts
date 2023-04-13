import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from "@components/auth";
import { SweetsComponent } from "@components/sweets";
import { ProductsComponent } from "@components/products";

const routes: Routes = [
  {
    path: "auth",
    component: AuthComponent
  },
  {
    path: "products",
    component: ProductsComponent,
    canActivate: [] // guard for user's right entered password
  },
  {
    path: "sweets",
    component: SweetsComponent,
    canActivate: [] // guard for user's right entered password
  },
  // {
  //   path: "add-sweet",
  //   component: AuthComponent,
  // canActivate: [] // guard for user's right entered password
  // },
  {
    path: "",
    redirectTo: "sweets", //All Sweets Component
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "auth",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
