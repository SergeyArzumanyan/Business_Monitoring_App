import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {
  HeaderComponent,
  LargeHeaderComponent,
  SmallHeaderComponent
} from '@Components/header';
import { AuthComponent } from "@Components/auth";

import { environment } from '../environments';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";

import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { InputNumberModule } from "primeng/inputnumber";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';
import { DialogModule } from "primeng/dialog";
import { RippleModule } from "primeng/ripple";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    LargeHeaderComponent,
    SmallHeaderComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
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
  ],
  providers: [
    ConfirmationService,
    MessageService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
