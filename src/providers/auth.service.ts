import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

//import { AngularFireAuth } from "angularfire2/auth";
//import { AngularFireDatabase } from "angularfire2/database";

@Injectable()
export class AuthService {

  //authState: firebase.User = null;

  constructor(/*private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,*/
    private router: Router) {

    /*this.afAuth.authState.subscribe(auth => {
      this.authState = auth;
    });*/
  }

  get isAuthenticated(): boolean {
    return false;
    //return this.authState !== null;
  }

  get currentUser() {
    return {};
    //return this.isAuthenticated ? this.authState : null;
  }

  get currentUserObservable() {
    return {};
    //return this.afAuth.authState;
  }

  get currentUserId() {
    return "";
    //return this.isAuthenticated ? this.authState.uid : "";
  }

  get isAnonymousUser() {
    return true;
    //return this.isAuthenticated ? this.authState.isAnonymous : false;
  }

  get currentDisplayName() {
    /*if (!this.authState) {
      return "Guest";
    } else if (this.isAnonymousUser) {
      return "Anonymous";
    } else {
      return this.authState.displayName || "No name!";
    }*/
    return "";
  }

  async anonymousLogin() {
    try {
      //this.authState = await this.afAuth.auth.signInAnonymously();
    } catch (err) {
      console.error(err);
    }
  }

  async emailSignUp(email: string, password: string) {
    try {
      //this.authState = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      await this.updateUserData();
    } catch (err) {
      console.error(err);
    }
  }

  async emailLogin(email: string, password: string) {
    try {
      //this.authState = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      //await this.updateUserData();
    } catch (err) {
      console.error(err);
    }
  }

  async logout() {
    //await this.afAuth.auth.signOut();
    this.router.navigate(["/"]);
  }

  private async updateUserData() {
    /*const path = `users/${this.currentUserId}`;
    const userData = {
      email: this.authState.email,
      name: this.authState.displayName
    };

    await this.db.object(path).update(userData);*/
  }

}
