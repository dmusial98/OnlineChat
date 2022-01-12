import { __decorate } from "tslib";
import { Injectable, EventEmitter } from '@angular/core';
let MessageWSService = class MessageWSService {
    constructor() {
        // Event służący do informowania o nadejściu wiadomości
        this.onMessage = new EventEmitter();
        // Event służący do informowania o połączeniu się nowego użytkownika
        this.onAnotherUserConneted = new EventEmitter();
        // Event służący do informowania o zerwaniu połączenia
        this.onClose = new EventEmitter();
        // Event służący do informowania o połączeniu
        this.onOpen = new EventEmitter();
        this.isOpen = false;
    }
    open() {
        const self = this;
        this.ws = new WebSocket(`ws://${location.host}/stream/`);
        this.ws.onerror = function () {
            console.log('WebSocket error');
        };
        this.ws.onopen = function () {
            self.isOpen = true;
            self.onOpen.emit(true);
            console.log('WebSocket connection established');
        };
        this.ws.onclose = function () {
            self.onClose.emit(true);
            self.isOpen = false;
            console.log('WebSocket connection closed');
        };
        this.ws.onmessage = function (msg) {
            const mes = JSON.parse(msg.data);
            if (mes["status"] == 1) {
                self.onMessage.emit(mes["data"]);
            }
            if (mes["status"] == 2) {
                self.onAnotherUserConneted.emit(true);
            }
            console.log('WebSocket message', msg.data);
        };
    }
};
MessageWSService = __decorate([
    Injectable({
        providedIn: 'root'
    })
], MessageWSService);
export { MessageWSService };
//# sourceMappingURL=message-ws.service.js.map