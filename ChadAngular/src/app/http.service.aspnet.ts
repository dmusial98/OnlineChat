import { Injectable } from '@angular/core';
import { User } from './user';
import { Message } from './message';
import { HttpServiceInterface } from './interfaces';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const URL = "/api"

@Injectable({
  providedIn: 'root'
})
export class HttpServiceASPNET implements HttpServiceInterface {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loginUserData: User = null;

  constructor(private httpClient: HttpClient) { }

  //apiUrl = "http://localhost:5000/api";
  apiUrl = "https://onlinechat.azurewebsites.net/api";

  changedLoginState(state: boolean) {
    this.loggedIn.next(state)
  }

  // Funkcja umożliwiająca logowanie
  login(user_name: string, user_password: string) {
    let response = this.httpClient.post( `${this.apiUrl}/auth/login`, {
      "login": user_name,
      "password": user_password
    });

    console.log(response);

    return response;
  }

  // Funkcja umożliwiająca rejestrację
  register(user_name: string, user_email: string, user_password: string) {
    return this.httpClient.post(`${this.apiUrl}/auth/register`, {
      "role": "user",
      "login": user_name,
      "password": user_password,
      "email": user_email
    });
  }

  getUsers() {
    return this.httpClient.get<User[]>(`${this.apiUrl}/users`);
  }

  getMessages(userId: number) {
    return this.httpClient.get<Message[]>(`${this.apiUrl}/messages/byUser?UserId=${userId}`);
  }

  getLastMessage(userId: number) {
    return this.httpClient.get<Message>(`${this.apiUrl}/messages/lastMsgBetweenUsers?UserId=${userId}`);
  }

  sendMessages(userId: number, messageContent: string) {
    return this.httpClient.post(`${this.apiUrl}/messages`, {
      "userToId": userId.toString(),
      "content": messageContent
    });
  }

  getUnreadMessagesNumber(): Observable<number> {
    return this.httpClient.get<number>(`${this.apiUrl}/users/unreadMessages`);
  }
  
  markMessagesAsRead(id: number): Observable<any>{
    return this.httpClient.head(`${this.apiUrl}/users/markMessagesAsRead/` + id);
  }

  sendChaptchaData(captchaResponse: string): Observable<any>{
    console.log(captchaResponse);
    return this.httpClient.post(`http://localhost:5000/api/auth/validateCaptcha`, {
      "captchaResponse": captchaResponse
    });
  }

  // Setter ustawiający wartość w polu loginUserData
  set user(user: User) {
    this.loginUserData = user;
  }
}
