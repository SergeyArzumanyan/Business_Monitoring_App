import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SweetsRoutingModule } from "@Components/sweets/sweets-routing.module";
import {
  SweetComponent,
  SweetsComponent
} from "@Components/sweets";

import { SharedModule } from "@Shared/shared.module";


@NgModule({
  declarations: [
    SweetsComponent,
    SweetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SweetsRoutingModule,
    SharedModule,
  ]
})
export class SweetsModule {
}
