import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceInterface } from '../interfaces';
import { User } from '../user';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidden = false;
  unreadMessages = 0;
  checkboxChecked = false;
  btType: ButtonType;
  buttonEnumType: typeof ButtonType = ButtonType;
  title = 'mdb-angular-free';
  registerFormSubmitted = false;
  loginFormSubmitted = false;
  successAlert = false;

  registerForm = new FormBuilder().group({
    user_name: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern("^[a-zA-Z]+$")
    ]),
    user_email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
    ]),
    user_password: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  loginForm = new FormBuilder().group({
    user_name: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern("^[a-zA-Z]+$")
    ]),
    user_password: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor(
    private router: Router,
    @Inject('HttpServiceInterface') private httpService: HttpServiceInterface,
  ) { }

  onRegisterSubmit() {
    this.registerFormSubmitted = true;
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value
      this.httpService.register(formValue.user_name, formValue.user_email, formValue.user_password)
    }
  }

  onLoginSubmit() {

    console.log('onLoginSubmit()')

    this.httpService.changedLoginState(true);
    this.httpService.loginUserData = new User(1, "user", true);

    //this.loginFormSubmitted = true;
    //if(this.registerForm.valid) {
    //  const formValue = this.loginForm.value
    //  this.httpService.login(formValue.user_name, formValue.user_password)
    //  .subscribe( response => {
    //    if (response.loggedin == true) {
    //      this.httpService.changedLoginState(response.loggedin);
    //      this.httpService.loginUserData = new User(response.user_id, response.user_name, response.loggedin);
    this.router.navigateByUrl("/chat")
    //    }
    //  })
    //}
  }

  navigateToChat() {
    this.router.navigate(['/chat']);
  }

  setUnreadMessageNumber() {
    this.unreadMessages = 15;
  }
  setButtonText(buttonType: ButtonType) {
    this.btType = buttonType;
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

  placeholderForRegisterUsername() {
    var placeholder = "Your name";
    if (this.registerFormSubmitted) {
      if (this.registerForm.controls['user_name'].hasError('required')) {
        placeholder = "Username is required";
      } else if (this.registerForm.controls['user_name'].hasError('minlength')) {
        placeholder = "Username is to short (min 3 characters)";
      } else if (this.registerForm.controls['user_name'].hasError('pattern')) {
        placeholder = "Username should only consist of letters";
      }
    }
    return placeholder;
  }

  placeholderForRegisterEmail() {
    var placeholder = "Your email";
    if (this.registerFormSubmitted) {
      if (this.registerForm.controls['user_email'].hasError('required')) {
        placeholder = "Email is required";
      } else if (this.registerForm.controls['user_email'].hasError('pattern')) {
        placeholder = "Email format is incorrect";
      }
    }
    return placeholder;
  }

  placeholderForRegisterPassword() {
    var placeholder = "Your password";
    if (this.registerFormSubmitted) {
      if (this.registerForm.controls['user_password'].hasError('required')) {
        placeholder = "Password is required";
      } else if (this.registerForm.controls['user_password'].hasError('minlength')) {
        placeholder = "Password is too short (min 3 characters)";
      }
    }
    return placeholder;
  }


  placeholderForLoginUsername() {
    var placeholder = "Your name";
    if (this.loginFormSubmitted) {
      if (this.loginForm.controls['user_name'].hasError('required')) {
        placeholder = "Username is required";
      } else if (this.loginForm.controls['user_name'].hasError('minlength')) {
        placeholder = "Username is to short (min 3 characters)";
      } else if (this.loginForm.controls['user_name'].hasError('pattern')) {
        placeholder = "Username should only consist of letters";
      }
    }
    return placeholder;
  }

  placeholderForLoginEmail() {
    var placeholder = "Your email";
    if (this.loginFormSubmitted) {
      if (this.loginForm.controls['user_email'].hasError('required')) {
        placeholder = "Email is required";
      } else if (this.loginForm.controls['user_email'].hasError('pattern')) {
        placeholder = "Email format is incorrect";
      }
    }
    return placeholder;
  }

  placeholderForLoginPassword() {
    var placeholder = "Your password";
    if (this.loginFormSubmitted) {
      if (this.loginForm.controls['user_password'].hasError('required')) {
        placeholder = "Password is required";
      } else if (this.loginForm.controls['user_password'].hasError('minlength')) {
        placeholder = "Password is too short (min 3 characters)";
      }
    }
    return placeholder;
  }
}


enum ButtonType {
  none,
  home,
  info,
}
