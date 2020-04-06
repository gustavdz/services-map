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
          // @ts-ignore
          this.usuario.isAdmin = resp.isAdmin;
          this.router.navigateByUrl('/map');
        }, (err) => {
            let message: string;
            message = err.error.message;
            Swal.fire({
            allowOutsideClick: false,
            text: message,
            icon: 'error',
            title: 'Lo sentimos'
            });
        });
  }


}
