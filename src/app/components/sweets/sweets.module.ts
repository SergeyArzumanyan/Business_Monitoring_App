import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { AddModule } from "@components/add/add.module";
import { SweetsRoutingModule } from './sweets-routing.module';
import { SweetComponent } from "@components/sweets/sweet";
import { SweetsComponent } from "@components/sweets/sweets.component";

import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
  declarations: [
    SweetComponent,
    SweetsComponent
  ],
  imports: [
    CommonModule,
    SweetsRoutingModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    AddModule,
    InputNumberModule,
    InputTextModule
  ]
})
export class SweetsModule { }
