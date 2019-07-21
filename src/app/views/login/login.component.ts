import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoginModel } from 'src/app/models/login-model';
import { RegisterModel } from 'src/app/models/register-model';
import { UserTokenModel } from 'src/app/models/user-token-model';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginModel: LoginModel = new LoginModel();

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.login(this.loginModel).subscribe(
      (token: UserTokenModel) => {
        sessionStorage.setItem("token", JSON.stringify(token));
        this.router.navigate(['/home']);
      },
      (error: any) => {
        // TODO: Implement your own error handling or leave it at service level.
        console.log(error);
      }
    )
  }
}
