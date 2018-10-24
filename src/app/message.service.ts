import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
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
