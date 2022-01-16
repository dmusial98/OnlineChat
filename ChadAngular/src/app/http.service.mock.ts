////import { Injectable } from '@angular/core';
////import { User } from './user';
////import { Message } from './message';
////import { HttpServiceInterface } from './interfaces';
////import { BehaviorSubject, Observable, of } from 'rxjs';

////const THIS_USER = new User(0, "user_name_0", true);

////const URL = "/api"

////@Injectable({
////  providedIn: 'root'
////})  
////export class HttpServiceMock implements HttpServiceInterface {
////  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
////  loginUserData: User = THIS_USER; 

////  constructor() { }

////  changedLoginState(state: boolean) {}

////  // Funkcja umożliwiająca logowanie
////  login(user_name: string, user_password: string) {
////    return of({})
////  }

////  // Funkcja umożliwiająca wylogowanie
////  logout() {
////    return of({})
////  }

////  // Funkcja umożliwiająca rejestrację
////  register(user_name: string, user_email: string, user_password: string) {
////    return of({
////        register: true
////    })
////  }

////  getUsers(){
////    return of({
////        data: [
////            new User(1, "user_name_1", true),
////            new User(2, "user_name_2", true),
////        ]
////    })
////  }

////  getMessages(id: number){
////      switch(id) {
////          case 1:
////            return of({
////                data: [
////                    new Message(0, "1 to 0, hello", new Date().toString()),
////                    new Message(1, "0 to 1, hello", new Date().toString()),
////                ]
////            })
////        case 2:
////            return of({
////                data: [
////                    new Message(0, "2 to 0, hello", new Date().toString()),
////                    new Message(2, "0 to 2, hello", new Date().toString()),
////                ]
////            })
////      }
////  }

////  sendMessages(mes: Message){
////    return of({})
////  }
////  // Setter ustawiający wartość w polu loginUserData
////  set user(user: User) {
////    this.loginUserData = user;
////  }  
////}
