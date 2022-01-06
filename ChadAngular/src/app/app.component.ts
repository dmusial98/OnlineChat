import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  hidden = false;
  unreadMessages = 0;
  private router: Router;

  hoveredButton:ButtonType; 
  selectedButton = ButtonType.home;
  buttonEnumType: typeof ButtonType = ButtonType;
  title = 'mdb-angular-free';

  successAlert = false;

  navigateToChat(){
    this.router.navigate(['/chat']);
  }

  setUnreadMessageNumber(){
    this.unreadMessages = 15;
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
  chat,
}