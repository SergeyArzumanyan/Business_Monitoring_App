import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public password: string = "Truffle2023";

  constructor(private router: Router) {}

  public checkPassword(inputedPassword: string): boolean {
    if (inputedPassword === this.password) {
      this.authenticated.next(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      this.router.navigateByUrl('sweets');
      return true;
    } else {
      console.log('wrong passsword.');
      return false;
    }
  }

}
