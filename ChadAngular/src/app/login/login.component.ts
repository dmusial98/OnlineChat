import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceInterface } from '../interfaces';
import { User } from '../user';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthGuard } from '../guards/auth-guard.service';
import { filter, switchMapTo, tap } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar'; 
import { BotDetectCaptchaModule, CaptchaComponent } from 'angular-captcha';
import { RecaptchaErrorParameters } from "ng-recaptcha";
import { resetFakeAsyncZone } from '@angular/core/testing';
import { RecaptchaModule} from 'ng-recaptcha';

@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  captcha: RecaptchaModule;
  hidden = false;
  unreadMessages = 0;
  checkboxChecked = false;
  btType: ButtonType;
  buttonEnumType: typeof ButtonType = ButtonType;
  title = 'mdb-angular-free';
  registerFormSubmitted = false;
  loginFormSubmitted = false;
  successAlert = false;
  isCaptchaCorrect = false;

  registerForm = new FormBuilder().group({
    user_name: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
    ]),
    user_email: new FormControl("", [
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
    ]),
    user_password: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
      Validators.pattern("[A-Z0-9a-z\\!\\@\\#\\$\\%\\^\\&\\*\\(\\)]+$"),
    ]),
  });

  loginForm = new FormBuilder().group({
    user_name: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
    ]),
    user_password: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  openSnackBar( msg:string) {
    this.snackBar.open(msg, "OK", {
      duration: 5000
    });
  }

  constructor(
    private router: Router,
    @Inject('HttpServiceInterface') private httpService: HttpServiceInterface,
    private authGuard: AuthGuard,
    private snackBar: MatSnackBar,
    
  ) { 
    //this.captchaComponent.captchaEndpoint = "http://localhost:5000/api/auth/validateCaptcha";
  }

  onRegisterSubmit() {
    this.registerFormSubmitted = true;
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value
      console.log(formValue);
      this.httpService.register(formValue.user_name, formValue.user_email, formValue.user_password)
      .subscribe(
        response => {
          this.httpService.login(formValue.user_name, formValue.user_password)
        .subscribe(response => {
          const token = (<any>response).accessToken;
          const refreshToken = (<any>response).refreshToken;
          localStorage.setItem("jwt", token);
          localStorage.setItem("refreshToken", refreshToken);
          this.httpService.changedLoginState(true);
          this.httpService.loginUserData = new User(this.authGuard.getIdFromJWT(), formValue.user_name, true);
          this.router.navigateByUrl("/chat")
        }, err => {
          this.openSnackBar("Unsuccessful login");
          this.httpService.changedLoginState(false);
        })
        },
        error => {
          this.openSnackBar("Register not complete");
        }
      )
        //filter(response => response.register),
        // switchMapTo(this.httpService.login(formValue.user_name, formValue.user_password)))
        // .subscribe( response => {
        //   console.log("jest response znowu")
        //   if (response.loggedin == true) {
        //     console.log("zalogowany")
        //     this.httpService.changedLoginState(response.loggedin);
        //     this.httpService.loginUserData = new User(response.user_id, response.user_name, response.loggedin);
        //     this.router.navigateByUrl("/chat")
        // }
     //})
    }
  }

  onLoginSubmit() {

    this.loginFormSubmitted = true;

    if (this.loginForm.valid) {

      const formValue = this.loginForm.value
      this.httpService.login(formValue.user_name, formValue.user_password)
        .subscribe(response => {
          const token = (<any>response).accessToken;
          const refreshToken = (<any>response).refreshToken;
          localStorage.setItem("jwt", token);
          localStorage.setItem("refreshToken", refreshToken);
          this.httpService.changedLoginState(true);
          this.httpService.loginUserData = new User(this.authGuard.getIdFromJWT(), formValue.user_name, true);
          this.router.navigateByUrl("/chat")
        }, err => {
          this.openSnackBar("Unsuccessful login");
          this.httpService.changedLoginState(false);
        })
    }
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
        placeholder = "Username is to short (min 5 characters)";
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
        placeholder = "Password is too short (min 5 characters)";
      } else if (this.registerForm.controls['user_password'].hasError('pattern')) {
        placeholder = "At least one digit, lowercase and uppercase";
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
        placeholder = "Username is to short (min 5 characters)";
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
        placeholder = "Password is too short (min 5 characters)";
      }
    }
    return placeholder;
  }

resolved(captchaResponse: string): void {
  this.httpService.sendChaptchaData(captchaResponse)
    .subscribe(
      response => {
        console.log("cos sie dzieje");
        console.log(response);
        if (response == true) {
          console.log("mamy sukces");
            this.isCaptchaCorrect = true;
        }
      },
      error => {
        console.log("mamy blad");
        this.isCaptchaCorrect = false;
        throw new Error(error);
      });
}


onError(errorDetails: RecaptchaErrorParameters): void {
  console.log(`reCAPTCHA error encountered; details:`, errorDetails);
}
}
enum ButtonType {
  none,
  home,
  info,
}
