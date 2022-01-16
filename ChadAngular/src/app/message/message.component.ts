import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() message = new Message(
    -1,
    "text should be here", 
    new Date().toString(),
  )

  @Input() incoming = true;

  constructor() { }

  ngOnInit(): void {
  }

  getDate(): string {
    return Message.getDate(this.message.sendTime);
  }

}
