import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;

  login(username: string, password: string): boolean {
    console.log('Attempting login with:', username, password);
    // Hardcoded credentials
    if (username === 'shriya' && password === 'shriya123') {
      this.isLoggedIn = true;
      console.log('Login successful, user is now logged in');
      return true;
    } else {
      console.log('Login failed with provided credentials');
      return false;
    }
  }

  logout() {
    this.isLoggedIn = false;
    console.log('User logged out');
  }

  isAuthenticated(): Observable<boolean> {
    return of(this.isLoggedIn); // Wraps the boolean value in an Observable
  }
}
