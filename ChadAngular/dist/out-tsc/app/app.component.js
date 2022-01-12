import { __decorate } from "tslib";
import { Component } from '@angular/core';
let AppComponent = class AppComponent {
    constructor() {
        this.hidden = false;
        this.unreadMessages = 0;
        this.selectedButton = ButtonType.home;
        this.buttonEnumType = ButtonType;
        this.title = 'mdb-angular-free';
        this.successAlert = false;
    }
    navigateToChat() {
        this.router.navigate(['/chat']);
    }
    setUnreadMessageNumber() {
        this.unreadMessages = 15;
    }
    setHoveredButton(buttonType) {
        this.hoveredButton = buttonType;
    }
    toggleBadgeVisibility() {
        this.hidden = !this.hidden;
    }
    copyToClipboard(value) {
        const tempInput = document.createElement("input");
        tempInput.value = value;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        this.successAlert = true;
        setTimeout(() => {
            this.successAlert = false;
        }, 900);
    }
};
AppComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
], AppComponent);
export { AppComponent };
var ButtonType;
(function (ButtonType) {
    ButtonType[ButtonType["none"] = 0] = "none";
    ButtonType[ButtonType["home"] = 1] = "home";
    ButtonType[ButtonType["info"] = 2] = "info";
    ButtonType[ButtonType["chat"] = 3] = "chat";
})(ButtonType || (ButtonType = {}));
//# sourceMappingURL=app.component.js.map