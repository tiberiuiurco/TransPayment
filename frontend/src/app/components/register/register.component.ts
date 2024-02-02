import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  // Required
  registerForm: FormGroup;

  // By me
  registerInfo = {};
  hide = true;
  error: string;
  success: string;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.registerForm = this.formBuilder.group({
      last_name: ['', Validators.required],
      first_name: ['', Validators.required],
      cnp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  register(content) {
    this.error = '';
    this.success = '';

    // if (!this.registerForm.valid) {
    //   this.error = 'Please complete all fields !';
    //   return;
    // }

    this.loginService
      .register(JSON.stringify(content))
      .then((res: any) => {
        if (res.message && !res.email) this.error = res.message;
        else {
          this.router.navigate(['/login']);
        }
      })
      .catch((err) => {
        if (err.error.message) this.error = err.error.message;
      });
  }

  submit() {
    // event handler for button with id "but"
    const last_name = document.getElementById('last_name')['value'];
    const first_name = document.getElementById('first_name')['value'];
    const cnp = document.getElementById('cnp')['value'];
    let email = document.getElementById('em')['value'];
    const username = document.getElementById('username')['value'];
    let password = document.getElementById('pass')['value'];
    const content = {
      last_name: last_name,
      first_name: first_name,
      cnp: cnp,
      email: email,
      username: username,
      password: password,
    };
    this.register(content);
  }
}
