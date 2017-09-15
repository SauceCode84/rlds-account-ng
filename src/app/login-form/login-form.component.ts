import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "providers/auth.service";

@Component({
  selector: "login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss"]
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit() {
    this.loginForm = this.buildForm();
  }

  private buildForm() {
    return this.fb.group({
      email: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      let { email, password } = this.loginForm.value;

      this.loading = true;
      await this.authService.emailLogin(email, password);
      this.loading = false;
    }
  }

}
