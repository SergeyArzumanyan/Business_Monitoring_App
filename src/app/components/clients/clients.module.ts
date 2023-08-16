import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { ClientsComponent } from './clients.component';

import { SharedModule } from "@Shared/shared.module";

import { HistoryService } from "@Core/services";


@NgModule({
  declarations: [
    ClientsComponent
  ],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    SharedModule
  ],
  providers: [
    HistoryService
  ]
})
export class ClientsModule { }
