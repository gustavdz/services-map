import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {UsuarioModel} from '../../models/usuario.model';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;
  recordarme = false;

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  onSubmit( form: NgForm ) {
    if ( form.invalid) { return; }
    Swal.fire({
      allowOutsideClick: false,
      text: 'Espere por favor',
      icon: 'info'
    });
    Swal.showLoading();
    this.auth.nuevoUsuario(this.usuario)
        .subscribe( resp => {
          Swal.close();
          if ( this.recordarme ) {
            localStorage.setItem('email', this.usuario.email);
          }
          if ( !resp['objUser']['email_verified_at'] ) {
              Swal.fire({
                  allowOutsideClick: false,
                  text: resp['message'],
                  icon: 'info',
                  title: 'Siguiente paso'
              });
          }
          this.router.navigateByUrl('/home');
        }, (err) => {
            let message: string;
            if ( err.error.message.email ) {
                message = err.error.message.email[0];
            } else if ( err.error.message.name ) {
                message = err.error.message.name[0];
            } else if ( err.error.message.password ) {
                message = err.error.message.password[0];
            } else if ( err.error.message.c_password ) {
                message = err.error.message.c_password[0];
            }
            Swal.fire({
            allowOutsideClick: false,
            text: message,
            icon: 'error',
            title: 'Error al autenticar'
            });
        });
  }


}
