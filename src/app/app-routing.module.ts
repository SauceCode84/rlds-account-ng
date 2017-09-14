import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { StudentListComponent } from "app/student-list/student-list.component";
import { StudentDetailComponent } from "app/student-detail/student-detail.component";

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