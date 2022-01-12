import { Message } from './message';

export class User {
  id: number;
  role: string
  login: string;
  password: string;
  email: string;
  messagesFrom: Message[];
  messagesTo: Message[];
  online: boolean;


  constructor(id: number, login: string, password: string, online: boolean = false) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.online = online;
  }
}
