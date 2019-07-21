import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterModel } from 'src/app/models/register-model';

declare var $: any;

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.css']
})
export class RegisterModalComponent implements OnInit {
  registerModel: RegisterModel = new RegisterModel();

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  /**
   * Register an account.
   */
  register() {
    this.authService.register(this.registerModel).subscribe(
      () => {
        // Close the register modal.
        $('#registerModal').modal('hide');
      }
    )
  }
}
