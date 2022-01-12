import { __decorate, __param } from "tslib";
import { Component, Inject, Input } from '@angular/core';
let ChatComponent = class ChatComponent {
    constructor(router, wsService, httpService) {
        this.router = router;
        this.wsService = wsService;
        this.httpService = httpService;
        this.searchContent = "";
        // lista użytkowników
        this.users = [];
        this.filteredUsers = [];
        // lista wiadomości z wybranym uzytkownikiem
        this.messagesToUser = [];
        // wybrany uzytkownik
        this.selectedUser = null;
        // Sprawdzenie czy uzytkownik nie jest zalogowany, jezeli tak - przejscie do głownego panelu
        if (!httpService.isLogin) {
            //this.router.navigate(['/login']);
        }
    }
    filter(filter) {
        if (filter == "") {
            this.filteredUsers = this.users;
        }
        else {
            this.filteredUsers = this.users.filter((user) => {
                return user.login.includes(filter);
            });
        }
    }
    onSearchChange(content) {
        this.filter(content);
    }
    ngOnInit() {
        this.reloadUsers();
        this.wsService.onAnotherUserConneted.subscribe((event => {
            this.reloadUsers();
        }));
        this.wsService.onMessage.subscribe((event => {
            this.getMessagesWithSelectedUser();
        }));
    }
    // Funkcja zwracająca nasze ID
    getMyId() {
        return this.httpService.loginUserData.id;
    }
    // Funkcja wysyłająca wiadomość
    sendMessage(e) {
        //
        //this.httpService.sendMessages(new Message(this.selectedUser.user_id,e)).subscribe(
        //  data => {
        //    console.log("ChatComponent, onSubmit:", data);
        //  },
        //  error => {
        //  });
    }
    // Funkcja przeładowująca listę użytkowników
    reloadUsers() {
        this.httpService.getUsers().subscribe(data => {
            if ("data" in data) {
                console.log("data");
                if (Array.isArray(data["data"])) {
                    this.users = data["data"];
                    this.filteredUsers = this.users;
                }
            }
        }, error => {
        });
    }
    // funkcja wywoływana gdy zostanie wybrany użytkownik na liście użytkowników
    userSelected(user) {
        this.selectedUser = user;
        console.log("Selected user", this.selectedUser);
        this.getMessagesWithSelectedUser();
    }
    // Funkcja pobierające listę wiadomości z danym użytkownikiem
    getMessagesWithSelectedUser() {
        this.httpService.getMessages(this.selectedUser.id).subscribe(data => {
            if ("data" in data) {
                console.log("data");
                if (Array.isArray(data["data"])) {
                    this.messagesToUser = data["data"];
                }
            }
        }, error => {
        });
    }
};
__decorate([
    Input()
], ChatComponent.prototype, "searchContent", void 0);
ChatComponent = __decorate([
    Component({
        selector: 'app-chat',
        templateUrl: './chat.component.html',
        styleUrls: ['./chat.component.scss']
    }),
    __param(2, Inject('HttpServiceInterface'))
], ChatComponent);
export { ChatComponent };
//# sourceMappingURL=chat.component.js.map