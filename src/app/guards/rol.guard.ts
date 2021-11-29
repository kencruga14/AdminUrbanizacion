import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
 
  canActivate(): boolean {
    if (this.auth.infoGuard == '1') {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}
