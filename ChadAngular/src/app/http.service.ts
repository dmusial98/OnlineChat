import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { Message } from './message';
import { HttpServiceInterface } from './interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

const URL = "/api"

@Injectable({
  providedIn: 'root'
})  
export class HttpService implements HttpServiceInterface {

  // dla uproszczenia działania aplikacji - UserService będzie przechowywać dane o zalogowanym uzytkowniku
  loggedIn: Observable<boolean> = new BehaviorSubject<boolean>(false);
  loginUserData: User; 

  constructor(private http: HttpClient) { }

  changedLoginState(state: boolean){}

  // Funkcja umożliwiająca logowanie
  login(user_name: string, user_password: string) {
    return this.http.post(URL + "/login", {
      user_name,
      user_password
    });
  }

  // Funkcja umożliwiająca wylogowanie
  logout() {
    return this.http.get(URL + "/logout");
  }

  // Funkcja umożliwiająca rejestrację
  register(user_name: string, user_email: string, user_password: string) {
    return this.http.post(URL + "/register", new User(-1, "", true));
  }

  getUsers(){
    return this.http.get(URL + "/users");
  }

  getMessages(id: number){
    return this.http.get(URL + "/messages/" + id);
  }

  sendMessages(mes: Message){
    return this.http.post(URL + "/messages/", mes);
  }
  // Setter ustawiający wartość w polu loginUserData
  set user(user: User) {
    this.loginUserData = user;
  }  
}
