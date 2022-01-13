import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpServiceInterface } from '../interfaces';
import { User } from '../user';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidden = false;
  unreadMessages = 0;
  checkboxChecked = false;
  btType:ButtonType; 
  buttonEnumType: typeof ButtonType = ButtonType;
  title = 'mdb-angular-free';

  successAlert = false;

  registerForm = new FormGroup({
    user_name: new FormControl(""),
    user_email: new FormControl(""),
    user_password: new FormControl(""),
  });

  form = new FormGroup({
    user_name: new FormControl(""),
    user_password: new FormControl(""),
  });

  constructor(
    private router: Router,
    @Inject('HttpServiceInterface') private httpService: HttpServiceInterface,
  ){}

  onRegisterSubmit(){
    const formValue = this.registerForm.value
    this.httpService.register(formValue.user_name, formValue.user_email, formValue.user_password)
  }
  
  onLoginSubmit(){
    const formValue = this.form.value
    this.httpService.login(formValue.user_name, formValue.user_password)
    .subscribe( response => {
      if (response.loggedin == true) {
        this.httpService.changedLoginState(response.loggedin);
        this.httpService.loginUserData = new User(response.user_id, response.user_name, response.loggedin);
        this.router.navigateByUrl("/chat")
      }
    })
  }

  navigateToChat(){
    this.router.navigate(['/chat']);
  }

  setUnreadMessageNumber(){
    this.unreadMessages = 15;
  }
  setButtonText(buttonType:ButtonType){
    this.btType=buttonType;
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