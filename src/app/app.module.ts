import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// HTTP
import { HttpClientModule } from '@angular/common/http';

// MATERIAL
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { HeaderComponent } from './pieces/header/header.component';
import { InitialsPipe } from './pipes/initials.pipe';
import { MigratePageComponent } from './pages/migrate-page/migrate-page.component';
import { ImportStepComponent } from './pages/migrate-page/import-step/import-step.component';
import { DebitStepComponent } from './pages/migrate-page/debit-step/debit-step.component';
import { CreditStepComponent } from './pages/migrate-page/credit-step/credit-step.component'


const MATERIAL_MODULES = [
  MatSnackBarModule, MatButtonModule, MatStepperModule, MatIconModule, MatCheckboxModule,
  MatTableModule, MatSortModule
]

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    UserPageComponent,
    HeaderComponent,
    InitialsPipe,
    MigratePageComponent,
    ImportStepComponent,
    DebitStepComponent,
    CreditStepComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ...MATERIAL_MODULES
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
