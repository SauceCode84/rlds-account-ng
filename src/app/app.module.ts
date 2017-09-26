import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule  } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AngularFireModule } from "angularfire2";
import { AngularFireDatabaseModule } from "angularfire2/database";
import { AngularFireAuthModule } from "angularfire2/auth";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { 
  AlertService,
  AngularFireKeyService,
  AuthService,
  FeesService,
  NotificationService,
  StatementService,
  StudentService
} from "providers";

import { AppComponent } from "./app.component";
import { AlertComponent } from "components/alert/alert.component";
import { MultiLevelMenuComponent } from "components/ml-menu/ml-menu.component";
import { MenuComponent } from "components/ml-menu/menu/menu.component";
import { MenuItemComponent } from "components/ml-menu/menu-item/menu-item.component";
import { StudentListComponent } from "app/student-list/student-list.component";
import { StudentDetailComponent } from "app/student-detail/student-detail.component";
import { StatementComponent } from "app/statement/statement.component";
import { SearchStudentComponent } from "app/search-student/search-student.component";
import { UserLoginComponent } from "./user-login/user-login.component";
import { LoginFormComponent } from "./login-form/login-form.component";
import { PaymentModalComponent } from "./payment-modal/payment-modal.component";
import { FeesListComponent } from './fees-list/fees-list.component';
import { FeesModalComponent } from "./fees-modal/fees-modal.component";
import { StudentFeeModalComponent } from "./student-fee-modal/student-fee-modal.component";

import { AppRoutingModule } from "app/app-routing.module";

import { DisplayGradePipe } from "../pipes/display-grade.pipe";
import { NADatePipe } from "pipes/na-date.pipe";

import { FormatNumberDirective } from "../directives/format-number.directive";

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
    UserLoginComponent,
    LoginFormComponent,
    PaymentModalComponent,
    FeesListComponent,
    FeesModalComponent,
    StudentFeeModalComponent,
    
    DisplayGradePipe,
    NADatePipe,
    
    FormatNumberDirective    
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
    StudentService,
    FeesService
  ],
  entryComponents: [
    PaymentModalComponent,
    FeesModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
