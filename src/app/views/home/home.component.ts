import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MessageModel } from 'src/app/models/message-model';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  users: string[] = [];
  messages: MessageModel[] = [];
  chatText: string = "";

  constructor(private zone: NgZone, private chatService: ChatService) {
    this.subscribeToEvents();
   }

  ngOnInit() {
    this.chatService.connect();
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }

  send() {
    this.chatService.send(this.chatText);
    this.chatText = "";
  }

  private subscribeToEvents() {
    this.chatService.eventUsers.subscribe(users => {
      this.users = users;
    });

    this.chatService.eventMessages.subscribe(messages => {
      console.log(messages);
      this.messages = messages;
    });
  }

  private addUser(user: string) {
    this.users.push(user);
  }

  private removeUser(user: string) {
    let index = this.users.indexOf(user);
    this.users.splice(index, 1);
  }

  private message(message: MessageModel) {
    this.messages.push(message);
  }

}
