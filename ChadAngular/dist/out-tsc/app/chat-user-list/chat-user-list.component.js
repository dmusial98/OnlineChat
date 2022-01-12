import { __decorate } from "tslib";
import { Component, Input, Output, EventEmitter } from '@angular/core';
let ChatUserListComponent = class ChatUserListComponent {
    constructor() {
        // Dane wyjsciowe z komponentu - zdarzenie wywoływane po naciśnieciu uzytkownika
        this.userClicked = new EventEmitter();
    }
    ngOnInit() {
    }
};
__decorate([
    Input()
], ChatUserListComponent.prototype, "users", void 0);
__decorate([
    Output()
], ChatUserListComponent.prototype, "userClicked", void 0);
ChatUserListComponent = __decorate([
    Component({
        selector: 'app-chat-user-list',
        templateUrl: './chat-user-list.component.html',
        styleUrls: ['./chat-user-list.component.scss']
    })
], ChatUserListComponent);
export { ChatUserListComponent };
//# sourceMappingURL=chat-user-list.component.js.map