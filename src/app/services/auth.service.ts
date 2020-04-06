import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UsuarioModel} from '../models/usuario.model';
import { map } from 'rxjs/operators';
import {environment} from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.baseURL;

  userToken: string;

  constructor( private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expire');
  }

  getUser() {
    const token = this.leerToken();
    return this.http.get(`${this.url}/users/get`, {
      headers: new HttpHeaders().set('Authorization', `${token}`)
    })
        .pipe(
            map( resp => {
              // @ts-ignore
              return resp.userObj;
            })
        );
  }

  login( usuario: UsuarioModel) {
    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };
    return this.http.post(
        `${this.url}/users/login`,
        authData
    ).pipe(
        map( resp => {
          // @ts-ignore
          this.guardarToken( resp.token, resp.expiresIn );
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
        `${this.url}/users/signup`,
        authData
    ).pipe(
        map( resp => {
          // @ts-ignore
          if ( resp.message === 'Registro correcto' ) {
            // @ts-ignore
            this.guardarToken( resp.token, resp.expiresIn );
          }
          return resp;
        })
    );
  }


  private guardarToken(idToken: string, expiresIn: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    localStorage.setItem('expire', expiresIn.toString());
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
    const expireDate = new Date(expire * 1000);
    return expireDate > new Date();
  }
}
