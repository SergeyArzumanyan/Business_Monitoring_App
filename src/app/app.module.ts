import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from "@components/auth/auth.component";
import { HeaderComponent } from './components/header/header.component';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LargeHeaderComponent } from './components/header/components/large-header/large-header.component';
import { SmallHeaderComponent } from './components/header/components/small-header/small-header.component';


// import { environment } from '../environments/environment';
// import { provideDatabase,getDatabase } from '@angular/fire/database';
// import { initializeApp,provideFirebaseApp } from '@angular/fire/app';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    LargeHeaderComponent,
    SmallHeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    // provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideDatabase(() => getDatabase())
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
