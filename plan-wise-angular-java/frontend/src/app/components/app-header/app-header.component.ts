import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})
export class HeaderComponent implements OnInit {
  token: string | null = '';
  mediaQuery: boolean = window.matchMedia('(max-width: 992px)').matches;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.mediaQuery = window.matchMedia('(max-width: 992px)').matches;
  }

  signOut(): void {
    localStorage.removeItem('token');
    this.token = null;
    this.router.navigate(['/login']);
  }

  ulStyle(): any {
    if (this.token) {
      return { visibility: 'visible' };
    } else {
      return this.mediaQuery ? { display: 'none', marginTop: 10 } : { visibility: 'hidden' };
    }
  }
}
