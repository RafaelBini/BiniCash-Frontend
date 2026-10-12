import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  account = { name: '', username: '', email: '', password: '' };
  submitting = false;

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router,
    private translate: TranslateService
  ) { }

  register(): void {
    if (this.submitting) return;
    if (!this.account.name.trim() || !this.account.username.trim() || !this.account.email.trim() || !this.account.password) {
      this.snack.open(this.translate.instant('REGISTER.REQUIRED'), undefined, { duration: 3500 });
      return;
    }

    this.submitting = true;
    this.userService.createAccount(this.account).subscribe(
      () => {
        this.snack.open(this.translate.instant('REGISTER.SUCCESS'), undefined, { duration: 4500 });
        this.router.navigate(['/login']);
      },
      error => {
        this.submitting = false;
        this.snack.open(error.error?.msg || this.translate.instant('REGISTER.ERROR'), undefined, { duration: 4500 });
      }
    );
  }
}
