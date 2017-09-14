import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule  } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { NotificationService } from 'providers/notification.service';
import { AuthService } from 'providers/auth.service';
import { AlertComponent } from "components/alert/alert.component";
import { AlertService } from "providers/alert.service";
import { StatementService } from "providers/statement.service";
import { StudentService } from "providers/student.service";
import { AngularFireKeyService } from "providers/angular-fire-key.service";

import { MultiLevelMenuComponent } from "components/ml-menu/ml-menu.component";
import { MenuComponent } from "components/ml-menu/menu/menu.component";
import { MenuItemComponent } from "components/ml-menu/menu-item/menu-item.component";
import { StudentListComponent } from "app/student-list/student-list.component";
import { StudentDetailComponent } from "app/student-detail/student-detail.component";
import { StatementComponent } from "app/statement/statement.component";
import { SearchStudentComponent } from "app/search-student/search-student.component";
import { UserLoginComponent } from "./user-login/user-login.component";

import { AppRoutingModule } from "app/app-routing.module";
import { DisplayGradePipe } from "../pipes/display-grade.pipe";
import { NADatePipe } from "pipes/na-date.pipe";

import { environment } from "environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    
    MultiLevelMenuComponent,
    MenuComponent,
    MenuItemComponent,
    StudentListComponent,
    StatementComponent,
    StudentDetailComponent,
    SearchStudentComponent,
    
    DisplayGradePipe,
    NADatePipe,
    UserLoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,

    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [
    AngularFireKeyService,

    NotificationService,
    AuthService,
    AlertService,
    StatementService,
    StudentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
