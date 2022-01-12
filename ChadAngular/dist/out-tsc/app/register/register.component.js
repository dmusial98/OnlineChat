import { __decorate, __param } from "tslib";
import { Component, Inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { User } from '../user';
let RegisterComponent = class RegisterComponent {
    constructor(formBuilder, router, httpService) {
        this.formBuilder = formBuilder;
        this.router = router;
        this.httpService = httpService;
        // zapisanie informacji o tym, że dane zostały wysłane do serwera i jesteśmy w trakcie oczekiwania na dane
        this.loading = false;
        // zapisanie informacji o tym, że użytkownik nacisnął przycisk akceptujący formularz
        this.submitted = false;
        // lista błędów otrzymanych z serwera
        this.serverErrors = [];
        // Sprawdzenie czy uzytkownik nie jest zalogowany, jezeli tak - przejscie do głownego panelu
        if (httpService.isLogin) {
            this.router.navigate(['/']);
        }
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
        // Stworzenie obiektu uzytkownika z danych formularza i przesłanie ich do serwera
        this.httpService.register(new User(0, this.registerForm.controls.user_name.value, this.registerForm.controls.user_password.value))
            // Subskrybcja do strumienia danych zwrotnych z zapytania http
            .subscribe(data => {
            if ("register" in data) {
                if (data["register"] === true) {
                    // przejscie do strony logowania jezeli udało się zarejestrować
                    this.router.navigate(['/login']);
                }
                else {
                    this.loading = false;
                    // dodanie błędów do listy jeżeli nie udało się zarejestrować użytkownika
                    this.serverErrors.push(JSON.stringify(data));
                    console.log("RegisterComponent, onSubmit:", data);
                }
            }
            else {
                // dodanie błędów do listy jeżeli nie udało się zarejestrować użytkownika
                this.loading = false;
                this.serverErrors.push(JSON.stringify(data));
                console.log("RegisterComponent, onSubmit:", data);
            }
        }, error => {
            this.loading = false;
        });
    }
};
RegisterComponent = __decorate([
    Component({
        selector: 'app-register',
        templateUrl: './register.component.html',
        styleUrls: ['./register.component.scss']
    }),
    __param(2, Inject('HttpServiceInterface'))
], RegisterComponent);
export { RegisterComponent };
//# sourceMappingURL=register.component.js.map