import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { MessageModel } from '../models/message-model';
import { UserTokenModel } from '../models/user-token-model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private connection: signalR.HubConnection;
  private subscriptions: any[] = [];

  private users: string[] = [];
  eventUsers: Subject<string[]> = new Subject<string[]>();

  private messages: MessageModel[] = [];
  eventMessages: Subject<MessageModel[]> = new Subject<MessageModel[]>();

  constructor() {
    // Build connection object.
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.basePath + "/chatHub", {
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => {
          let userToken: UserTokenModel = JSON.parse(window.sessionStorage.getItem('token'));
          console.log(userToken);
          return userToken.accessToken;
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

      // Subscribe to server hub events.
      this.subscribeToServerHubEvents();
   }

   /**
    * Connect to the server.
    */
   connect() {
     return this.connection.start().then(() => {
       // Do what you need to on connect.
     }).catch(error => {
       console.log(error);
     });
   }

   /**
    * Disconnect from the server.
    */
   disconnect() {
     this.connection.stop();
   }

   /**
    * Send message to chat.
    * @param text 
    */
   send(text: string) {
     let model: MessageModel = new MessageModel();
     model.message = text;
    this.connection.invoke("send", model).catch(error => {
      console.log(error);
    });
   }

   /**
    * Subscribe to all server hub events after connection.
    */
   subscribeToServerHubEvents() {
     /**
      * Add user to user list.
      */
     this.connection.on("add-user", user => {
       this.users.push(user);
       this.eventUsers.next(this.users);
     });

     /**
      * Remove user from user list.
      */
     this.connection.on("remove-user", user => {
       let index = this.users.indexOf(user);
       this.users.splice(index, 1);
       this.eventUsers.next(this.users);
     });

     /**
      * Get user list from server.
      */
     this.connection.on("users", users => {
       this.users = users;
       this.eventUsers.next(this.users);
     })

     /**
      * Receive a message.
      */
     this.connection.on("message", message => {
       this.messages.push(message);
       this.eventMessages.next(this.messages);
     });
   }
}
