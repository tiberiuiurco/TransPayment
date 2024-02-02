import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router) {}
  title = 'frontend';
  localStorage = localStorage;

  getFirstName() {
    return localStorage.getItem('first_name');
  }

  goToProfile() {
    this.router.navigate(['profil']);
  }

  goToPayments() {
    this.router.navigate(['plati']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  isLoginOrRegister() {
    return this.router.url === '/login' || this.router.url === '/register';
  }
}
