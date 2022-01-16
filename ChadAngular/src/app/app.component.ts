import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceInterface } from './interfaces';
import { first } from 'rxjs/operators';

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

  constructor(
    private router: Router,
    @Inject('HttpServiceInterface') public httpService: HttpServiceInterface,
  ){}

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
}

enum ButtonType{
  none,
  home, 
  info,
}
