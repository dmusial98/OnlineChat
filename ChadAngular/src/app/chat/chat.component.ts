import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { Message } from '../message';
import { MessageWSService } from '../message-ws.service';
import { HttpServiceInterface } from '../interfaces';
import { first } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  @Input() searchContent = ""
  @ViewChild('messageScroll') private messageScrollContainer: ElementRef;
  
  // lista użytkowników
  users: User[] = [];
  filteredUsers: User[] = [];

  // lista wiadomości z wybranym uzytkownikiem
  messagesToUser: Message[] = [];
  messageNumber = 0;

  intervalId = setInterval( () => this.getMessagesWithSelectedUser(), 100 );

  // wybrany uzytkownik
  selectedUser: User = null;

  messageForm = new FormGroup({
    message_text: new FormControl(""),
  })

  constructor(
    private router: Router,
    private wsService: MessageWSService,
    @Inject('HttpServiceInterface') private httpService: HttpServiceInterface,
  ) {
    // Sprawdzenie czy uzytkownik nie jest zalogowany, jezeli tak - przejscie do głownego panelu
    this.httpService.loggedIn
    .pipe(first())
    .subscribe(value => {
      if (!value) { 
        this.router.navigate(['/login']);
      }
    })
  }

  onMessageSubmit(){
    var message = new Message(this.selectedUser.user_id, this.messageForm.value.message_text, new Date().toUTCString());
    this.httpService.sendMessages(message).subscribe(_ => {
      this.getMessagesWithSelectedUser();
    });
  }

  filter(filter: string) {
    if (filter == "") {
      this.filteredUsers = this.users
    } else {
      this.filteredUsers = this.users.filter((user) => {
        return user.user_name.includes(filter)
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
    return this.httpService.loginUserData.user_id;
  }

  // Funkcja wysyłająca wiadomość
  sendMessage(e) {
//
    
    this.httpService.sendMessages(new Message(this.selectedUser.user_id,e, new Date().toString())).subscribe(
      data => {
        console.log("ChatComponent, onSubmit:", data);
      },
      error => {
      });
  }

  // Funkcja przeładowująca listę użytkowników
  reloadUsers() {
    this.httpService.getUsers().subscribe(
      data => {
        if ("data" in data) {
          console.log("data");
          if (Array.isArray(data["data"])) {
            this.users = data["data"] as User[];
            this.filteredUsers = this.users
          }
        }
      },
      error => {
      });
  }

  // funkcja wywoływana gdy zostanie wybrany użytkownik na liście użytkowników
  userSelected(user: User) {
    this.selectedUser = user;
    this.getMessagesWithSelectedUser();
  }

  // Funkcja pobierające listę wiadomości z danym użytkownikiem
  getMessagesWithSelectedUser() {
    this.httpService.getMessages(this.selectedUser.user_id).subscribe(
      data => {
        if ("data" in data) {
          if (Array.isArray(data["data"])) {
            this.messagesToUser = data["data"] as Message[];
          }
        }
      },
      error => {
      });
    var newMessageNumber = this.messagesToUser.length
    if (this.messageNumber != newMessageNumber) {
      this.messageNumber = newMessageNumber
      try {
        this.messageScrollContainer.nativeElement.scrollTop = this.messageScrollContainer.nativeElement.scrollHeight;
      } catch(err) { }      
      }
    }
    

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
