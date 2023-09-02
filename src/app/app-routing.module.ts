import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from "@Components/auth";

import {
  AuthGuard,
  AuthRouteGuard
} from "@Core/guards";
import { Configs } from "@Core/configs";

const routes: Routes = [
  {
    path: "auth",
    component: AuthComponent,
    canActivate: [AuthRouteGuard]
  },
  {
    path: Configs.PrimaryItemRoute,
    loadChildren: () => import('@Components/primary-item/primary-item.module').then(m => m.PrimaryItemModule),
    canLoad: [AuthGuard]
  },
  {
    path: Configs.SecondaryItemRoute,
    loadChildren: () => import("@Components/secondary-item/secondary-item.module").then(m => m.SecondaryItemModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'clients',
    loadChildren: () => import('@Components/clients/clients.module').then(m => m.ClientsModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'history',
    loadChildren: () => import('@Components//history/history.module').then(m => m.HistoryModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'add',
    loadChildren: () => import('@Components/add/add.module').then(m => m.AddModule),
    canLoad: [AuthGuard]
  },
  {
    path: "",
    redirectTo: Configs.PrimaryItemRoute,
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: Configs.PrimaryItemRoute,
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
