import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @Input() message: Message = {
    message_to_user_id: -1,
    message_text: "text should be here"
  }

  @Input() incoming = true;

  constructor() { }

  ngOnInit(): void {
  }

}
