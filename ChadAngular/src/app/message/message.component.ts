import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() message: Message = {
    id: -1,
    userFromId: -1,
    userToId: -1,
    content: "text should be here",
    sendTime: "1111.11.11 00.00"
  }

  @Input() incoming = true;

  constructor() { }

  ngOnInit(): void {
  }

}
