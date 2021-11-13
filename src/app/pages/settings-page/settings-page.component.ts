import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.css']
})
export class SettingsPageComponent implements OnInit {

  constructor(
    public userService: UserService,
    private snack: MatSnackBar,
  ) { }


  public languages = [
    { id: 'en-US', name: 'SETTINGS.LANGUAGE.EN_US' },
    { id: 'pt-BR', name: 'SETTINGS.LANGUAGE.PT_BR' },
  ]

  public me: any;
  private version: Map<string, number> = new Map<string, number>();

  ngOnInit(): void {
    this.me = { ...this.userService.me };
  }

  onTextChange(property: string, newValue: string) {
    var myUpdatedVersion = (this.version.get(property) || 0) + 1;
    this.version.set(property, myUpdatedVersion);
    setTimeout(() => {
      if (myUpdatedVersion >= (this.version.get(property) || 0)) {
        this.updateProperty(property, newValue)
      }
    }, 1500)
  }

  async updateConfig(name: string, newValue: string) {
    try {
      await this.userService.updateConfig(name, newValue).toPromise();
      await this.userService.updateMe();
      this.snack.open('Preferences saved!', undefined, { duration: 2700 });
    }
    catch (error) {
      this.snack.open('Failed when trying to save', undefined, { duration: 3700 });
    }
  }

  async updateProperty(property: string, newValue: string) {
    try {
      await this.userService.updateInfo({ [property]: newValue }).toPromise();
      await this.userService.updateMe();
      this.snack.open('Preferences saved!', undefined, { duration: 2700 });
    }
    catch (error) {
      this.snack.open('Failed when trying to save', undefined, { duration: 3700 });
    }

  }

}
