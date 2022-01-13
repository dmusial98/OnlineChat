import { Injectable } from '@angular/core';
import { User } from './user';
import { Message } from './message';
import { HttpServiceInterface } from './interfaces';
import { of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const THIS_USER = new User(1, "user_name_0", "", true);

const URL = "/api"

@Injectable({
  providedIn: 'root'
})  
export class HttpServiceMock implements HttpServiceInterface {
  isLogin: boolean = true;
  loginUserData: User = THIS_USER; 

  constructor(private http: HttpClient) { }

  // Funkcja umożliwiająca logowanie
  login(user: User) {
    return of({})
  }

  // Funkcja umożliwiająca wylogowanie
  logout() {
    return of({})
  }

  // Funkcja umożliwiająca rejestrację
  register(user: User) {
    return of({
        register: true
    })
  }

  getUsers() {

    return this.http.get<User[]>("http://localhost:5000/api/users");
      //{
      //  headers: new HttpHeaders({
      //    "Content-Type": "application/json"
      //  })
      //});

    //return of({
    //    data: [
    //        new User(1, "user_name_1", "", true),
    //        new User(2, "user_name_2", "", true),
    //    ]
    //})
  }

  getMessages(id: number){

    return this.http.get<Message[]>(`http://localhost:5000/api/messages/byUser?UserId=${id}`,
      {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      });

    //switch(id) {
      //    case 1:
      //      return of({
      //          data: [
      //              new Message(0, "1 to 0, hello"),
      //              new Message(1, "0 to 1, hello"),
      //          ]
      //      })
      //  case 2:
      //      return of({
      //          data: [
      //              new Message(0, "2 to 0, hello"),
      //              new Message(2, "0 to 2, hello"),
      //          ]
      //      })
      //}
  }

  sendMessages(mes: Message){
    return of({})
  }
  // Setter ustawiający wartość w polu loginUserData
  set user(user: User) {
    this.loginUserData = user;
  }  
}
