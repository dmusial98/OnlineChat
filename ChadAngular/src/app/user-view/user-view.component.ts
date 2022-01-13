import { Component, Input, OnInit } from '@angular/core';
import { User } from '../user';

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

  constructor() { }

  ngOnInit(): void {
  }

}
