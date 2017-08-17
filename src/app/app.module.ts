import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from "@angular/router";

import { TypeaheadModule } from "ngx-bootstrap";

import { AppComponent } from "./app.component";
import { AlertComponent } from "components/alert/alert.component";
import { AlertService } from "providers/alert.service";
import { StatementService } from "providers/statement.service";

import { MultiLevelMenuComponent } from "components/ml-menu/ml-menu.component";
import { MenuComponent } from "components/ml-menu/menu/menu.component";
import { MenuItemComponent } from "components/ml-menu/menu-item/menu-item.component";

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    
    MultiLevelMenuComponent,
    MenuComponent,
    MenuItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([]),
    TypeaheadModule.forRoot()
  ],
  providers: [
    AlertService,
    StatementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
