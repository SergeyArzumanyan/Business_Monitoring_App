import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {

  public currentPassword: string = "Truffle2023";
  public passwordInput: string = "";

  public checkPassword(): boolean {
    return this.passwordInput === this.currentPassword;
  }
}
