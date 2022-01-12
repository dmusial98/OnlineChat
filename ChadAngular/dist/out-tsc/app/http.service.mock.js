import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { User } from './user';
import { of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
const THIS_USER = new User(0, "user_name_0", "", true);
const URL = "/api";
let HttpServiceMock = class HttpServiceMock {
    constructor(http) {
        this.http = http;
        this.isLogin = true;
        this.loginUserData = THIS_USER;
    }
    // Funkcja umożliwiająca logowanie
    login(user) {
        return of({});
    }
    // Funkcja umożliwiająca wylogowanie
    logout() {
        return of({});
    }
    // Funkcja umożliwiająca rejestrację
    register(user) {
        return of({
            register: true
        });
    }
    getUsers() {
        return of({
            data: [
                new User(1, "user_name_1", "", true),
                new User(2, "user_name_2", "", true),
            ]
        });
    }
    getMessages(id) {
        return this.http.get(`http://localhost:5000/api/messages/byUser?UserId=${id}`, {
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
    sendMessages(mes) {
        return of({});
    }
    // Setter ustawiający wartość w polu loginUserData
    set user(user) {
        this.loginUserData = user;
    }
};
HttpServiceMock = __decorate([
    Injectable({
        providedIn: 'root'
    })
], HttpServiceMock);
export { HttpServiceMock };
//# sourceMappingURL=http.service.mock.js.map