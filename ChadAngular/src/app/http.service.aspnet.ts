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

  changedLoginState(state: boolean) {
    this.loggedIn.next(state)
  }

  // Funkcja umożliwiająca logowanie
  login(user_name: string, user_password: string) {
    return this.httpClient.post("/api/login/", {
      "user_name": user_name,
      "user_password": user_password
    });
  }

  // Funkcja umożliwiająca wylogowanie
  logout() {
    return this.httpClient.get("api/logout/");
  }

  // Funkcja umożliwiająca rejestrację
  register(user_name: string, user_email: string, user_password: string) {
    return this.httpClient.post("/api/register/", {
      "user_name": user_email,
      "user_password": user_password
    });
  }

  getUsers() {
    return this.httpClient.get<User[]>("http://localhost:5000/api/users");
/*    return this.httpClient.get("/api/users/")*/
  }

  getMessages(userId: number) {
    var messagesFromSelectedUser = this.httpClient.get<Message[]>(`http://localhost:5000/api/messages/byUser?UserId=${userId}`);

    //var messagesFromSelectedUser = this.httpClient.get("/api/messages/" + id) as any;
    return messagesFromSelectedUser;
  }

  sendMessages(mes: Message) {
    return this.httpClient.post("/api/messages/", {
      "message_to_user_id": mes.userToId.toString(),
      "message_text": mes.content
    });
  }
  // Setter ustawiający wartość w polu loginUserData
  set user(user: User) {
    this.loginUserData = user;
  }
}
