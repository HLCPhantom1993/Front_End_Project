import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  /* MessageComponent 可以显示所有消息，包括当HeroService获取到英雄数据时发送的那条 */
  /* Angular only binds to public component properties */
  constructor(public messageService: MessageService) { }
  /* messageService属性必须是公共属性，因为它会被绑定到模板中 */
  /* Angular只会绑定到组件的公共属性 */

  ngOnInit() {
  }

}
