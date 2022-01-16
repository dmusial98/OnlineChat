import {Message} from './message'

export class User {
  id: number;
  role: string;
  login: string;
  password: string;
  email: string;
  online: boolean;
  messagesFrom: Message[];
  messagesTo: Message[];


  constructor(id: number, login: string, online: boolean = false) {
    this.id = id;
    this.login = login;
    this.online = online;
  }
}
