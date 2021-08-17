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
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

// NGX MASK
import { NgxMaskModule, IConfig } from 'ngx-mask'
export const options: Partial<IConfig> | (() => Partial<IConfig>) | null = null;

// Locale
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

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
import { CreditStepComponent } from './pages/migrate-page/credit-step/credit-step.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import { NewManualDebitsDialogComponent } from './dialogs/new-manual-debits-dialog/new-manual-debits-dialog.component';
import { FinishStepComponent } from './pages/migrate-page/finish-step/finish-step.component';
import { UndoMigrationComponent } from './pages/undo-migration/undo-migration.component';
import { CreateTransactionChildrenDialogComponent } from './dialogs/create-transaction-children-dialog/create-transaction-children-dialog.component';
import { ManageRulesDialogComponent } from './dialogs/manage-rules-dialog/manage-rules-dialog.component';
import { ShortDatePipe } from './pipes/short-date.pipe';

const MATERIAL_MODULES = [
  MatSnackBarModule, MatButtonModule, MatStepperModule, MatIconModule, MatCheckboxModule,
  MatTableModule, MatSortModule, MatDialogModule, MatTooltipModule, MatMenuModule
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
    CreditStepComponent,
    ConfirmDialogComponent,
    NewManualDebitsDialogComponent,
    FinishStepComponent,
    UndoMigrationComponent,
    CreateTransactionChildrenDialogComponent,
    ManageRulesDialogComponent,
    ShortDatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    ...MATERIAL_MODULES
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
