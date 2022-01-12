import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
let MessageComponent = class MessageComponent {
    constructor() {
        this.message = {
            id: -1,
            userFromId: -1,
            userToId: -1,
            content: "text should be here",
            sendTime: "1111.11.11 00.00"
        };
        this.incoming = true;
    }
    ngOnInit() {
    }
};
__decorate([
    Input()
], MessageComponent.prototype, "message", void 0);
__decorate([
    Input()
], MessageComponent.prototype, "incoming", void 0);
MessageComponent = __decorate([
    Component({
        selector: 'app-message',
        templateUrl: './message.component.html',
        styleUrls: ['./message.component.scss']
    })
], MessageComponent);
export { MessageComponent };
//# sourceMappingURL=message.component.js.map