import { Component } from '@angular/core';
import { AuthService } from "@Services/auth.service";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-large-header',
  templateUrl: './large-header.component.html',
  styleUrls: ['./large-header.component.scss']
})
export class LargeHeaderComponent {
  public isAuthenticated: BehaviorSubject<boolean> = this.authService.authenticated;
  public isAlreadyAuthenticated: boolean = !!sessionStorage.getItem('isAuthenticated');

  constructor(private authService: AuthService) {}

}
