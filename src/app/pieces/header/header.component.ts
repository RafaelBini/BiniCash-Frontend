import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public userService: UserService,
    private router: Router,
  ) { }

  me: any;

  async ngOnInit() {
    this.me = this.userService.me;
  }

  goMain() {
    this.router.navigate(['main'])
  }

}
