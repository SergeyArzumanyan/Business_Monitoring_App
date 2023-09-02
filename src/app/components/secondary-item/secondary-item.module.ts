import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SecondaryItemRoutingModule } from "./secondary-item-routing.module";

import { SecondaryItemComponent } from "@Components/secondary-item/secondary-item.component";
import { SharedModule } from "@Shared/shared.module";


@NgModule({
  declarations: [
    SecondaryItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    SecondaryItemRoutingModule,
  ]
})
export class SecondaryItemModule {
}
