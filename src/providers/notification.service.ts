import { Injectable } from "@angular/core";

import { BehaviorSubject } from "rxjs";

@Injectable()
export class NotificationService {

  //public messaging = firebase.messaging();
  public currentNotification = new BehaviorSubject(null);

  constructor(/*private db: AngularFireDatabase, private afAuth: AngularFireAuth*/) { }

  async getPermission() {
    try {
      /*await this.messaging.requestPermission();
      let token = await this.messaging.getToken();
      this.updateToken(token);*/
    } catch(err) {
      console.error("Unable to get premission to notify.");
    }
  }

  updateToken(token) {
    /*this.afAuth.authState
      .take(1)
      .subscribe(user => {
        console.log("Current user...", user);

        if (!user) {
          return;
        }

        let data = { [user.uid]: token };
        this.db.object("fcmTokens/").update(data);
      });*/
  }

  receiveNotifications() {
    /*this.messaging.onMessage(payload => {
      console.log("Message received...", payload);
      this.currentNotification.next(payload);
    });*/
  }

}
