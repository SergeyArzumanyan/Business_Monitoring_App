import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import {
  TableComponent,
  FiltersComponent,
  DFiltersComponent,
  MFiltersComponent,
  ContextMenuComponent,
  TableEditDialogComponent,
} from '@Shared/components';

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
import { InputMaskModule } from "primeng/inputmask";

@NgModule({
  declarations: [
    DragDirective,
    TableComponent,
    FiltersComponent,
    DFiltersComponent,
    MFiltersComponent,
    ContextMenuComponent,
    TableEditDialogComponent,
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
        InputMaskModule,
        RouterLink,
        FormsModule,
        ReactiveFormsModule,
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
    DragDirective,
    InputMaskModule,
    TableComponent,
    FiltersComponent,
    DFiltersComponent,
    MFiltersComponent,
    ContextMenuComponent,
    TableEditDialogComponent,
  ]
})
export class SharedModule {}
