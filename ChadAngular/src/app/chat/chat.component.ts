import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { Message } from '../message';
import { MessageWSService } from '../message-ws.service';
import { HttpServiceInterface } from '../interfaces';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Input() searchContent = ""
 
  // lista użytkowników
  users: User[] = [];
  filteredUsers: User[] = [];

  // lista wiadomości z wybranym uzytkownikiem
  messagesToUser: Message[] = [];

  // wybrany uzytkownik
  selectedUser: User = null;

  constructor(
    private router: Router,
    private wsService: MessageWSService,
    @Inject('HttpServiceInterface') private httpService: HttpServiceInterface,
  ) {
    // Sprawdzenie czy uzytkownik nie jest zalogowany, jezeli tak - przejscie do głownego panelu
    if (!httpService.isLogin) {
      //this.router.navigate(['/login']);
    }
  }

  filter(filter: string) {
    if (filter == "") {
      this.filteredUsers = this.users
    } else {
      this.filteredUsers = this.users.filter((user) => {
        return user.login.includes(filter)
      })
    }
  }

  onSearchChange(content: string) {
    this.filter(content)
  }

  ngOnInit() {
    this.reloadUsers();
    this.wsService.onAnotherUserConneted.subscribe((event => {
      this.reloadUsers();
    }));
    this.wsService.onMessage.subscribe((event =>{
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

    this.httpService.getUsers().subscribe(_users => { this.users = _users; this.filteredUsers = _users; });

    console.log(this.users);

    //this.httpService.getUsers().subscribe(
    //  data => {
    //    if ("data" in data) {
    //      console.log("data");
    //      if (Array.isArray(data["data"])) {
    //        this.users = data["data"] as User[];
    //        this.filteredUsers = this.users
    //      }
    //    }
    //  },
    //  error => {
    //  });
  }

  // funkcja wywoływana gdy zostanie wybrany użytkownik na liście użytkowników
  userSelected(user: User) {
    this.selectedUser = user;
    console.log("Selected user", this.selectedUser)
    this.getMessagesWithSelectedUser();
  }

  // Funkcja pobierające listę wiadomości z danym użytkownikiem
  getMessagesWithSelectedUser() {

    this.httpService.getMessages(1).subscribe(_mes => this.messagesToUser = _mes);

    console.log(this.messagesToUser);

    //this.httpService.getMessages(this.selectedUser.id).subscribe(
    //  data => {
    //    if ("data" in data) {
    //      console.log("data");
    //      if (Array.isArray(data["data"])) {
    //        this.messagesToUser = data["data"] as Message[];
    //      }
    //    }

    //  },
    //  error => {
    //  });
  }

}
