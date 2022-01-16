import { Component, Inject, Input, OnInit } from '@angular/core';
import { User } from '../user';
import { Message } from '../message';
import { HttpServiceInterface } from '../interfaces';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  @Input() active = false;
  @Input() user = new User(
    -1,
    "name",
    false
  );
  message: Message;

  constructor(@Inject('HttpServiceInterface') private httpService: HttpServiceInterface) { }

  ngOnInit(): void {
    this.httpService.getLastMessage(this.user.id).subscribe(
      _message => {
        this.message = _message;
      }, err => {
        console.log('lack of last message ;(');
    })
  }

  getDate(): string {
    return Message.getDate(this.message.sendTime);
  }

}
