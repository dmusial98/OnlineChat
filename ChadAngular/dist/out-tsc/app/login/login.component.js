import { __decorate } from "tslib";
import { Component } from '@angular/core';
let LoginComponent = class LoginComponent {
    constructor() {
        this.hidden = false;
        this.unreadMessages = 0;
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
    setButtonText(buttonType) {
        this.btType = buttonType;
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
LoginComponent = __decorate([
    Component({
        selector: 'app-root',
        templateUrl: './login.component.html',
        styleUrls: ['./login.component.scss']
    })
], LoginComponent);
export { LoginComponent };
var ButtonType;
(function (ButtonType) {
    ButtonType[ButtonType["none"] = 0] = "none";
    ButtonType[ButtonType["home"] = 1] = "home";
    ButtonType[ButtonType["info"] = 2] = "info";
})(ButtonType || (ButtonType = {}));
//# sourceMappingURL=login.component.js.map