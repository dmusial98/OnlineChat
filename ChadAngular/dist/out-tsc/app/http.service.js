import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
const URL = "/api";
let HttpService = class HttpService {
    constructor(http) {
        this.http = http;
        // dla uproszczenia działania aplikacji - UserService będzie przechowywać dane o zalogowanym uzytkowniku
        this.isLogin = false;
    }
    // Funkcja umożliwiająca logowanie
    login(user) {
        return this.http.post(URL + "/login", user);
    }
    // Funkcja umożliwiająca wylogowanie
    logout() {
        return this.http.get(URL + "/logout");
    }
    // Funkcja umożliwiająca rejestrację
    register(user) {
        return this.http.post(URL + "/register", user);
    }
    getUsers() {
        return this.http.get(URL + "/users");
    }
    getMessages(id) {
        return this.http.get(URL + "/messages/" + id);
    }
    sendMessages(mes) {
        return this.http.post(URL + "/messages/", mes);
    }
    // Setter ustawiający wartość w polu loginUserData
    set user(user) {
        this.loginUserData = user;
    }
};
HttpService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], HttpService);
export { HttpService };
//# sourceMappingURL=http.service.js.map