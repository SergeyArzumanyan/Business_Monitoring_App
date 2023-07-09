import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from "@Components/auth";

import {
  AuthGuard,
  AuthRouteGuard
} from "@Core/guards";

const routes: Routes = [
  {
    path: "auth",
    component: AuthComponent,
    canActivate: [AuthRouteGuard]
  },
  {
    path: "products",
    loadChildren: () => import("@Components/products/products.module").then(m => m.ProductsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'sweets',
    loadChildren: () => import('@Components/sweets/sweets.module').then(m => m.SweetsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'add',
    loadChildren: () => import('@Components/add/add.module').then(m => m.AddModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'clients',
    loadChildren: () => import('@Components/clients/clients.module').then(m => m.ClientsModule),
    canLoad: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "auth",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "sweets",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
