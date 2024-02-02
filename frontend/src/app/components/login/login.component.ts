import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  // Required
  loginForm: FormGroup;

  // By me
  hide = true;
  error: string;
  success: string;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(content) {
    this.error = '';
    this.success = '';

    this.loginService
      .login(JSON.stringify(content))
      .then((res: any) => {
        if (res.message) this.error = res.message;
        else {
          this.router.navigate(['/profil']);
        }
      })
      .catch((err) => {
        if (err.error.message) this.error = err.error.message;
      });
  }

  submit() {
    // event handler for button with id "but"
    let email = document.getElementById('em')['value'];
    let password = document.getElementById('pass')['value'];
    const content = { email: email, password: password };
    this.login(content);
  }
  // login() {
  //   this.error = '';
  //   this.success = '';
  //
  //   if (!this.loginForm.valid) {
  //     this.error = 'Please complete all fields !';
  //     return;
  //   }
  //
  //   this.loginService
  //     .login(JSON.stringify(this.loginForm.value))
  //     .then((res: any) => {
  //       if (res.message) this.error = res.message;
  //       else {
  //         this.router.navigate(['/profil']);
  //       }
  //     })
  //     .catch((err) => {
  //       if (err.error.message) this.error = err.error.message;
  //     });
  // }
}
