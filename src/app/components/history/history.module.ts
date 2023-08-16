import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from "@Shared/shared.module";
import { HistoryRoutingModule } from './history-routing.module';

import { OrdersComponent, ConsumptionsComponent, ProfitComponent } from '@Components/history';
import { HistoryService } from "@Core/services";

@NgModule({
  declarations: [
    OrdersComponent,
    ConsumptionsComponent,
    ProfitComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HistoryRoutingModule
  ],
  providers: [
    HistoryService
  ]
})
export class HistoryModule {
}
