import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

//Services
import { AuthService } from '../../services/auth.service';

//Material
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent implements OnInit {
  /*Cambiar color del fondo*/
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
  
  flag: Boolean = false;
  contrasena: string = "password";

  createFormGroup() {
    return new FormGroup({
      email: new FormControl('', 
      [ Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),]),
      password: new FormControl('', 
      [ Validators.required, Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'),]),
      confirmpassword: new FormControl('', 
      [ Validators.required,Validators.pattern('^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\\D*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$'),]),
    });
  }

  registroForm: FormGroup;

  constructor(private authService: AuthService, private router: Router) {
    this.registroForm = this.createFormGroup();
  }

  ngOnInit(): void {
    /*Cambiar color del fondo*/
    this.bodyTag.classList.add('registro-page');
    this.htmlTag.classList.add('registro-page');
  }

  ngOnDestroy() {
    /*Cambiar color del fondo*/
    this.bodyTag.classList.remove('registro-page');
    this.htmlTag.classList.remove('registro-page');
  }

  signUp() {
    if (this.registroForm.valid) {
      if (this.password.value == this.confirmpassword.value) {
        this.authService.signUp(this.registroForm.value).subscribe(
          (res) => {
            // localStorage.setItem('token', res.token);
            this.router.navigate(['/login']);
          },
          (err) => {
            console.log(err);
            window.alert('El correo ya existe, intenta iniciar sesión');
          }
        );
      } else {
        window.alert('Las contraseñas no coinciden');
      }
    } else {
      console.log('no valido');
      window.alert('Verifique que la información sea valida');
    }
  }
  
  monstrarContrasena(monstrar){
    this.flag = monstrar;
    this.contrasena = (this.flag == true) ? 'text':'password'
}

  get email() {
    return this.registroForm.get('email');
  }
  get password() {
    return this.registroForm.get('password');
  }
  get confirmpassword() {
    return this.registroForm.get('confirmpassword');
  }

}
