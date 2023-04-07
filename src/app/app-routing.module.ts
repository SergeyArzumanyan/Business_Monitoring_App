import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from "@components/auth/auth.component";

const routes: Routes = [
  {
    path: "auth",
    component: AuthComponent
  },
  {
    path: "products",
    component: AuthComponent
  },
  {
    path: "sweets",
    component: AuthComponent
  },
  // {
  //   path: "add-sweet",
  //   component: AuthComponent
  // },
  {
    path: "",
    redirectTo: "", //All Sweets Component
    pathMatch: "full",
    canActivate: [] // guard for user's right entered password
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
