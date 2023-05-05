import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from "@components/auth";
import { ProductsComponent } from "@components/products";
import { AuthGuard } from "@Guards/auth.guard";
import { AuthRouteGuard } from "@Guards/auth-route.guard";

const routes: Routes = [
  {
    path: "auth",
    component: AuthComponent,
    canActivate: [AuthRouteGuard]
  },
  {
    path: "products",
    component: ProductsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sweets',
    loadChildren: () => import('@components/sweets/sweets.module').then(m => m.SweetsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'add',
    loadChildren: () => import('@components/add/add.module').then(m => m.AddModule),
    canLoad: [AuthGuard]
  },
  {
    path: "",
    redirectTo: "sweets",
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
