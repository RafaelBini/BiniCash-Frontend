import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private userService: UserService,
    private sharedService: SharedService,
    private snack: MatSnackBar,
    private router: Router
  ) { }

  user = {
    username: '',
    password: ''
  }

  ngOnInit(): void {
  }

  login() {

    this.userService.authenticate(this.user.username, this.user.password).subscribe(result => {
      localStorage.setItem('api_token', result.token)
      this.router.navigate(['main'])
    },
      error => {
        this.snack.open(error.error.msg, undefined, { duration: 3500 })
      })



  }

}
