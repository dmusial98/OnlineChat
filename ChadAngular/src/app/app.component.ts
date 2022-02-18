import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceInterface } from './interfaces';
import { catchError, first } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  loggedIn = false;
  hidden = false;
  unreadMessages = null;

  hoveredButton:ButtonType; 
  selectedButton = ButtonType.home;
  buttonEnumType: typeof ButtonType = ButtonType;
  title = 'mdb-angular-free';

  successAlert = false;
  interval: any;

  constructor(
    private router: Router,
    @Inject('HttpServiceInterface') public httpService: HttpServiceInterface,
  ){
    this.httpService.loggedIn.subscribe((value) => {
      if(value == true) {
        this.interval = setInterval(() => this.checkForUnreadMessages(), 1000)
      }
    } 
)}

  navigateToChat(){
    this.router.navigate(['/chat']);
  }

  navigateToLogin(){
    this.router.navigate(['/login']);
  }

  navigateToInfo(){
    this.router.navigate(['/info']);
  }

  navigateToHomePage() {
    this.httpService.loggedIn
    .pipe(first())
    .subscribe(value => {
      value ? this.navigateToChat() : this.navigateToLogin();
    })
  }

  logOut() {
    this.loggedIn = false;
    this.httpService.changedLoginState(false);
    this.httpService.loginUserData = null;
    localStorage.removeItem("jwt");
    localStorage.removeItem("refreshToken");
    this.router.navigate(['/login']);
  }

  checkForUnreadMessages(){
      this.httpService.getUnreadMessagesNumber()
      .subscribe((number) => {
        console.log("number of unread: " + number)
        this.setUnreadMessageNumber(number);
      })
    
  }

  setUnreadMessageNumber(value: number){
    if (value == 0) 
      this.unreadMessages = null;
    else 
      this.unreadMessages = value;
  }
  setHoveredButton(buttonType:ButtonType){
    this.hoveredButton=buttonType;
  }
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
  copyToClipboard(value: string): void {
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

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}

enum ButtonType{
  none,
  home, 
  info,
}
