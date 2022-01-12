import { __decorate } from "tslib";
import { Component, Input } from '@angular/core';
import { User } from '../user';
let UserViewComponent = class UserViewComponent {
    constructor() {
        this.active = false;
        this.user = new User(-1, "name", "", false);
    }
    ngOnInit() {
    }
};
__decorate([
    Input()
], UserViewComponent.prototype, "active", void 0);
__decorate([
    Input()
], UserViewComponent.prototype, "user", void 0);
UserViewComponent = __decorate([
    Component({
        selector: 'app-user-view',
        templateUrl: './user-view.component.html',
        styleUrls: ['./user-view.component.scss']
    })
], UserViewComponent);
export { UserViewComponent };
//# sourceMappingURL=user-view.component.js.map