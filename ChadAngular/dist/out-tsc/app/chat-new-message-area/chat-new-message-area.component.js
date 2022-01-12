import { __decorate } from "tslib";
import { Component, Output, EventEmitter } from '@angular/core';
let ChatNewMessageAreaComponent = class ChatNewMessageAreaComponent {
    constructor() {
        // Dane wyjsciowe z komponentu - zdarzenie wywoływane po naciśnieciu przycisku
        this.sendButtonClicked = new EventEmitter();
        this.message = "";
    }
    ngOnInit() {
    }
    sendMessage() {
        if (this.message) {
            this.sendButtonClicked.emit(this.message);
            this.message = "";
        }
    }
};
__decorate([
    Output()
], ChatNewMessageAreaComponent.prototype, "sendButtonClicked", void 0);
ChatNewMessageAreaComponent = __decorate([
    Component({
        selector: 'app-chat-new-message-area',
        templateUrl: './chat-new-message-area.component.html',
        styleUrls: ['./chat-new-message-area.component.scss']
    })
], ChatNewMessageAreaComponent);
export { ChatNewMessageAreaComponent };
//# sourceMappingURL=chat-new-message-area.component.js.map