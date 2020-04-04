import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UsuarioModel} from '../models/usuario.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'http://localhost:8000/api/v1/auth';

  userToken: string;

  constructor( private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expire');
  }

  login( usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post(
        `${this.url}/login`,
        authData
    ).pipe(
        map( resp => {
          this.guardarToken( resp ['access_token'], resp ['expires_in'] );
          return resp;
        })
    );
  }

  nuevoUsuario( usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      c_password: usuario.password,
      name: usuario.name
    };
    return this.http.post(
        `${this.url}/register`,
        authData
    ).pipe(
        map( resp => {
          if ( resp['objUser']['email_verified_at'] ) {
            this.guardarToken( resp ['access_token'], resp ['expires_in'] );
          }
          return resp;
        })
    );
  }


  private guardarToken(idToken: string, expiresIn: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds(Number(expiresIn));
    localStorage.setItem('expire', hoy.getTime().toString());
  }

  leerToken() {
    if ( localStorage.getItem('token') ) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    const expire = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if ( expireDate > new Date() ) {
      return true;
    } else {
      return false;
    }
  }
}