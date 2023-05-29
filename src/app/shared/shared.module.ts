import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InputNumberModule } from "primeng/inputnumber";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { RippleModule } from "primeng/ripple";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { KeyFilterModule } from "primeng/keyfilter";
import { TooltipModule } from "primeng/tooltip";
import { DragDirective } from "@Core/directives";

@NgModule({
  declarations: [
    DragDirective
  ],
  imports: [
    CommonModule,
    PasswordModule,
    ButtonModule,
    NgOptimizedImage,
    ProgressSpinnerModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    RippleModule,
    InputTextModule,
    MultiSelectModule,
    KeyFilterModule,
    TooltipModule,
  ],
  exports: [
    PasswordModule,
    ButtonModule,
    NgOptimizedImage,
    ProgressSpinnerModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    DialogModule,
    RippleModule,
    InputTextModule,
    MultiSelectModule,
    KeyFilterModule,
    TooltipModule,
    DragDirective
  ]
})
export class SharedModule { }
