import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.css']
})
export class TitleComponent implements OnInit {

  @Input() public text: string = '';
  @Input() public routerLink: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
