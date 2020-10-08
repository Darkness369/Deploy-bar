import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuarios: any = [];

  // private URL = 'http://localhost:3501/api';
  
  // URL_SERVIDOR
  private URL = 'https://backend-bar.herokuapp.com/api';

  constructor(private http: HttpClient, private router: Router) { }

  signUp(user: any) {
    return this.http.post<any>(this.URL + '/signup', user);
  }
  signIn(user: any) {
    return this.http.post<any>(this.URL + '/signin', user);
  }
  getUserLoggedIn() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }
  loggedIn() {
    return !!localStorage.getItem('token');
  }
  getToken() {
    return localStorage.getItem('token');
  }
  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
