import { MigratePageComponent } from './pages/migrate-page/migrate-page.component';
import { AlreadyLoggedGuard } from './guards/already-logged.guard';
import { AuthGuard } from './guards/auth.guard';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: LoginPageComponent, canActivate: [AlreadyLoggedGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [AlreadyLoggedGuard] },
  { path: 'main', component: UserPageComponent, canActivate: [AuthGuard] },
  { path: 'migrate', component: MigratePageComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
