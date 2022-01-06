import { Observable } from "rxjs";
import { Message } from "./message";
import { User } from "./user";

export interface HttpServiceInterface {
  isLogin: boolean;
  loginUserData: User;

  // Funkcja umożliwiająca logowanie
  login(user: User): Observable<Object>;

  // Funkcja umożliwiająca wylogowanie
  logout(): Observable<Object>;

  // Funkcja umożliwiająca rejestrację
  register(user: User): Observable<Object>;

  getUsers(): Observable<Object>;

  getMessages(id: number): Observable<Object>;

  sendMessages(mes: Message): Observable<Object>;

  // Setter ustawiający wartość w polu loginUserData
  set user(user: User);
}
  