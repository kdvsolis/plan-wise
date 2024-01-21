import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const isNotExpired = decoded.exp && decoded.exp > Date.now() / 1000;
      if (isNotExpired) {
        return true;
      } else {    
        this.router.navigate(['/login']);
        return false;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }
}
