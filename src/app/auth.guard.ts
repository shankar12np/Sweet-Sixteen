import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    let isAuthenticated = false;

    this.authService.isAuthenticated().subscribe((auth) => {
      isAuthenticated = auth;
      if (!auth) {
        console.log('Unauthorized access. Redirecting to login.');
        this.router.navigate(['/login']);
      }
    });

    return isAuthenticated;
  }
}
