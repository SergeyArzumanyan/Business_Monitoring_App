import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { ToastService } from "@Services/toast.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public password: string = "Truffle2023";

  constructor(private router: Router, private toastService: ToastService) {}

  public checkPassword(inputedPassword: string): boolean {
    if (inputedPassword === this.password) {
      this.authenticated.next(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      this.router.navigateByUrl('sweets');
      this.toastService.showToast('success', 'Successful', 'Authenticated successfully');
      return true;
    } else {
      this.authenticated.next(false);
      this.toastService.showToast('error', 'Error', 'Password Is Incorrect');
      return false;
    }
  }

}
