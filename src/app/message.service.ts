/* Message服务将会被注射到HeroService中 */
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  /* message服务对外暴露了它的messages缓存以及两个方法 */
  /* define message property, which is a string array */
  messages: string[] = [];

  /* define method that will be called in MessageComponent */
  add(message: string) {
    this.messages.push(message);
  }

  /* clear messages string by empty it */
  clear() {
    this.messages = [];
  }
}
