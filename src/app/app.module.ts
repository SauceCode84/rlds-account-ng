import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule  } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { AlertComponent } from "components/alert/alert.component";
import { AlertService } from "providers/alert.service";
import { StatementService } from "providers/statement.service";
import { StudentService } from "providers/student.service";

import { MultiLevelMenuComponent } from "components/ml-menu/ml-menu.component";
import { MenuComponent } from "components/ml-menu/menu/menu.component";
import { MenuItemComponent } from "components/ml-menu/menu-item/menu-item.component";
import { StudentListComponent } from "app/student-list/student-list.component";
import { StatementComponent } from "app/statement/statement.component";

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    
    MultiLevelMenuComponent,
    MenuComponent,
    MenuItemComponent,
    StudentListComponent,
    StatementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    NgbModule.forRoot()
  ],
  providers: [
    AlertService,
    StatementService,
    StudentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
