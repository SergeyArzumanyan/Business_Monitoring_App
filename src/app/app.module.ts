import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthComponent } from "@components/auth";
import { HeaderComponent } from '@components/header';
import { LargeHeaderComponent, SmallHeaderComponent } from '@components/header/components';
import { SweetsComponent } from '@components/sweets';
import { ProductsComponent } from '@components/products';
import { LargeProductsComponent } from '@components/products/components/large-products';
import { SmallProductsComponent } from '@components/products/components/small-products';

import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { PasswordModule } from "primeng/password";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";

import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    LargeHeaderComponent,
    SmallHeaderComponent,
    SweetsComponent,
    ProductsComponent,
    LargeProductsComponent,
    SmallProductsComponent,
  ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        CommonModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideDatabase(() => getDatabase()),
        PasswordModule,
        ButtonModule,
        NgOptimizedImage,
    ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {
}
