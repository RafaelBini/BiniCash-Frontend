import { CurrenciesPageComponent } from './pages/currencies-page/currencies-page.component';
import { SourcesPageComponent } from './pages/sources-page/sources-page.component';
import { ManageRulesPageComponent } from './pages/manage-rules-page/manage-rules-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { UndoMigrationComponent } from './pages/undo-migration/undo-migration.component';
import { MigratePageComponent } from './pages/migrate-page/migrate-page.component';
import { AlreadyLoggedGuard } from './guards/already-logged.guard';
import { AuthGuard } from './guards/auth.guard';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTransactionsPageComponent } from './pages/my-transactions-page/my-transactions-page.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent, canActivate: [AlreadyLoggedGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [AlreadyLoggedGuard] },
  { path: 'main', component: UserPageComponent, canActivate: [AuthGuard] },
  { path: 'my-transactions', component: MyTransactionsPageComponent, canActivate: [AuthGuard] },
  { path: 'migrate', component: MigratePageComponent, canActivate: [AuthGuard] },
  { path: 'migrate/undo', component: UndoMigrationComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsPageComponent, canActivate: [AuthGuard] },
  { path: 'rules', component: ManageRulesPageComponent, canActivate: [AuthGuard] },
  { path: 'sources', component: SourcesPageComponent, canActivate: [AuthGuard] },
  { path: 'currencies', component: CurrenciesPageComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoriesPageComponent, canActivate: [AuthGuard] },
  { path: 'categories/:categoryId', component: CategoriesPageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
