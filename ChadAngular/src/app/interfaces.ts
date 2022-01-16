import { Observable } from "rxjs";
import { Message } from "./message";
import { User } from "./user";

export interface HttpServiceInterface {
  loggedIn: Observable<boolean>;
  loginUserData: User;

  changedLoginState(state: boolean);
  // Funkcja umożliwiająca logowanie
  login(user_name: string, user_password: string): Observable<any>;

  // Funkcja umożliwiająca wylogowanie
  //logout(): Observable<Object>;

  // Funkcja umożliwiająca rejestrację
  register(user_name: string, user_email: string, user_password: string): Observable<any>;

  getUsers(): Observable<User[]>;

  getMessages(id: number): Observable<Message[]>;

  sendMessages(userId: number, messageContent: string): Observable<Object>;

  // Setter ustawiający wartość w polu loginUserData
  set user(user: User);
}
