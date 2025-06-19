import { CustomDatePipe } from './pipes/custom-date.pipe';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// HTTP
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// CDK
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';

// NGX MASK
import { NgxMaskModule, IConfig } from 'ngx-mask'
export const options: Partial<IConfig> | (() => Partial<IConfig>) | null = null;

// Locale
import { DatePipe, DecimalPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

// Translation
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// HighCharts
import { ChartModule } from 'angular-highcharts';

// Custom Prototypes
import '../assets/custom-prototypes.ts';

// HTTP Interceptor 
import { HTTP_INTERCEPTORS } from '@angular/common/http';

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
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { CustomNumberPipe } from './pipes/custom-number.pipe';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { NewCategoryDialogComponent } from './dialogs/new-category-dialog/new-category-dialog.component';
import { TransferCategoryDialogComponent } from './dialogs/transfer-category-dialog/transfer-category-dialog.component';
import { ThousandSeparatorTranslatePipe } from './pipes/thousand-separator-translate.pipe';
import { ManageRulesPageComponent } from './pages/manage-rules-page/manage-rules-page.component';
import { NewCurrencyComponent } from './dialogs/new-currency/new-currency.component';
import { TitleComponent } from './pieces/title/title.component';
import { SourcesPageComponent } from './pages/sources-page/sources-page.component';
import { EditSourceDialogComponent } from './dialogs/edit-source-dialog/edit-source-dialog.component';
import { CurrenciesPageComponent } from './pages/currencies-page/currencies-page.component';
import { EditStagedTransactionsDialogComponent } from './edit-staged-transactions-dialog/edit-staged-transactions-dialog.component';
import { AnalyticsPageComponent } from './pages/analytics-page/analytics-page.component';
import { AnalyticsDebitsPageComponent } from './pages/analytics-debits-page/analytics-debits-page.component';
import { DebitDetailsDialogComponent } from './dialogs/debit-details-dialog/debit-details-dialog.component';
import { AllTransactionsPageComponent } from './pages/all-transactions-page/all-transactions-page.component';
import { ExportInvestmentsDialogComponent } from './dialogs/export-investments-dialog/export-investments-dialog.component';
import { TithePageComponent } from './pages/tithe-page/tithe-page.component';
import { YieldEntryDialogComponent } from './dialogs/yield-entry-dialog/yield-entry-dialog.component';
import { EditTransactionDialogComponent } from './dialogs/edit-transaction-dialog/edit-transaction-dialog.component';


const MATERIAL_MODULES = [
  MatSnackBarModule, MatButtonModule, MatStepperModule, MatIconModule, MatCheckboxModule,
  MatTableModule, MatSortModule, MatDialogModule, MatTooltipModule, MatMenuModule,
  MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatDatepickerModule,
  MatNativeDateModule
]

const CDK_MODULES = [
  DragDropModule, ClipboardModule
]

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

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
    CustomDatePipe,
    SettingsPageComponent,
    CustomNumberPipe,
    CategoriesPageComponent,
    NewCategoryDialogComponent,
    TransferCategoryDialogComponent,
    ThousandSeparatorTranslatePipe,
    ManageRulesPageComponent,
    NewCurrencyComponent,
    TitleComponent,
    SourcesPageComponent,
    EditSourceDialogComponent,
    CurrenciesPageComponent,
    EditStagedTransactionsDialogComponent,
    AnalyticsPageComponent,
    AnalyticsDebitsPageComponent,
    DebitDetailsDialogComponent,
    AllTransactionsPageComponent,
    ExportInvestmentsDialogComponent,
    TithePageComponent,
    YieldEntryDialogComponent,
    EditTransactionDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ChartModule,
    NgxMaskModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ...MATERIAL_MODULES,
    ...CDK_MODULES
  ],
  providers: [
    DecimalPipe, CustomDatePipe, DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
