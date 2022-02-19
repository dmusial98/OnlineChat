import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../user';
import { Message } from '../message';
import { MessageWSService } from '../message-ws.service';
import { AuthGuard } from '../guards/auth-guard.service';
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

  intervalId = setInterval(() => this.getMessagesWithSelectedUser(), 1000);

  // wybrany uzytkownik
  selectedUser: User = null;

  messageForm = new FormGroup({
    message_text: new FormControl(""),
  })

  constructor(
    private router: Router,
    private wsService: MessageWSService,
    private authGuard: AuthGuard,
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

  onMessageSubmit() {
    var msg = this.messageForm.value.message_text;
    this.messageForm.reset();
    this.httpService.sendMessages(this.selectedUser.id, msg)
      .subscribe(_ => {
        this.getMessagesWithSelectedUser();
      });


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
    this.wsService.onMessage.subscribe((event => {
      if (this.selectedUser !== undefined && this.selectedUser !== null)
        this.getMessagesWithSelectedUser();
    }));
  }


  // Funkcja zwracająca nasze ID
  getMyId() {
    return this.httpService.loginUserData.id;
  }

  // Funkcja wysyłająca wiadomość
  sendMessage(e) {

    this.httpService.sendMessages(this.selectedUser.id, e).subscribe(
      data => {
      },
      error => {
      });
  }

  // Funkcja przeładowująca listę użytkowników
  reloadUsers() {
    this.httpService.getUsers().subscribe(
      data => {
        this.users = data; this.filteredUsers = data;
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

    if (this.selectedUser) {
      this.httpService.getMessages(this.selectedUser.id).subscribe(
        data => {
          this.messagesToUser = data;
          this.httpService.getLastMessage(this.selectedUser.id)
          .subscribe(
            messsage => {
            if(messsage.userFromId == this.selectedUser.id){
              this.httpService.markMessagesAsRead(this.selectedUser.id)
              .subscribe(() => {});
            }
          }, error => {
            
          }
          )
        },
        error => {
          this.authGuard.tryRefreshingTokens(localStorage.getItem("jwt"));
        });
        
    }  
      var newMessageNumber = this.messagesToUser.length
      if (this.messageNumber != newMessageNumber) {
        this.messageNumber = newMessageNumber
        try {
          this.messageScrollContainer.nativeElement.scrollTop = this.messageScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
      }

  }


  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
