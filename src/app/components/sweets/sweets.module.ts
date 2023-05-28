import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AddModule } from "@components/add/add.module";
import { SweetsRoutingModule } from './sweets-routing.module';
import { SweetComponent } from "@components/sweets/sweet";
import { SweetsComponent } from "@components/sweets/sweets.component";

import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { TooltipModule } from "primeng/tooltip";

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
        InputTextModule,
        ConfirmDialogModule,
        TooltipModule,
        FormsModule
    ]
})
export class SweetsModule {
}
