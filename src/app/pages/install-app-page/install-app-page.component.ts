import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-install-app-page',
  templateUrl: './install-app-page.component.html',
  styleUrls: ['./install-app-page.component.css']
})
export class InstallAppPageComponent {
  readonly downloadUrl = `${environment.apiHost}/download/android`;
}
