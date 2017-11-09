import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentListComponent } from "app/student-list/student-list.component";
import { StudentDetailComponent } from "app/student-detail/student-detail.component";
import { FeesListComponent } from "app/fees-list/fees-list.component";
import { AccountListComponent } from "app/account-list/account-list.component";

export const routes: Routes = [
  {
    path: "",
    component: StudentListComponent
  },
  {
    path: "student/:id",
    component: StudentDetailComponent
  },
  {
    path: "student",
    component: StudentDetailComponent
  },
  {
    path: "fees",
    component: FeesListComponent
  },
  {
    path: "accounts",
    component: AccountListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { enableTracing: false }   // debug only
  )],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }