import { Message } from './message';

export class User {
  public id: number;
  public role: string
  public login: string;
  public password: string;
  public email: string;
  public messagesFrom: Message[];
  public  messagesTo: Message[];
  public online: boolean;


  constructor(id: number, login: string, password: string, online: boolean = false) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.online = online;
  }
}
