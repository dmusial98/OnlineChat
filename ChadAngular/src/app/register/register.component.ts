import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpServiceInterface } from '../interfaces';
import { User } from '../user';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // obiekt formularza
  registerForm: FormGroup;
  // zapisanie informacji o tym, że dane zostały wysłane do serwera i jesteśmy w trakcie oczekiwania na dane
  loading = false;
  // zapisanie informacji o tym, że użytkownik nacisnął przycisk akceptujący formularz
  submitted = false;
  // lista błędów otrzymanych z serwera
  serverErrors: String[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject('HttpServiceInterface') private httpService: HttpServiceInterface
  ) {
    // Sprawdzenie czy uzytkownik nie jest zalogowany, jezeli tak - przejscie do głownego panelu
    this.httpService.loggedIn
    .pipe(first())
    .subscribe(value => {
      if (value) { 
        this.router.navigate(['/']);
      }
    })
    
  }

  // Funkcja wywoływana po zainicjalizowaniu komponentu
  ngOnInit() {
    // Tworzenie grupy pól formularza
    this.registerForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      user_password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  // Getter zwracający pola formularza
  get formControls() {
    return this.registerForm.controls;
  }

  // Funkcja akceptująca formularz
  onSubmit() {
    this.submitted = true;
    this.serverErrors = [];

    // Sprawdzenie poprawności danych w formularzu
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;

  }
}
