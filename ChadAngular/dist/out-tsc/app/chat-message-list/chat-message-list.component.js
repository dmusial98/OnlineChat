import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let ChatMessageListComponent = class ChatMessageListComponent {
    constructor() {
        // Dane wejściowe komponentu - wiadomości oraz id użytkownika
        this.messages = [];
        this.myId = 0;
    }
    ngOnInit() {
    }
};
__decorate([
    Input()
], ChatMessageListComponent.prototype, "messages", void 0);
__decorate([
    Input()
], ChatMessageListComponent.prototype, "myId", void 0);
ChatMessageListComponent = __decorate([
    Component({
        selector: 'app-chat-message-list',
        templateUrl: './chat-message-list.component.html',
        styleUrls: ['./chat-message-list.component.scss']
    })
], ChatMessageListComponent);
export { ChatMessageListComponent };
//# sourceMappingURL=chat-message-list.component.js.map