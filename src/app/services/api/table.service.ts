import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {TableModel} from '../../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private url = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient,
              private auth: AuthService) {
    this.auth.leerToken();
  }

  crearMesa( table: TableModel ) {

    return this.http.post(`${ this.url }/table`, table, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( (resp: any) => {
              table.id = resp.id;
              return table;
            })
        );

  }

  actualizarMesa( table: TableModel ) {

    const tableTemp = {
      ...table
    };

    delete tableTemp.id;

    return this.http.put(`${ this.url }/table/${ table.id }.json`, tableTemp, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });


  }

  borrarMesa( id: number ) {

    return this.http.delete(`${ this.url }/table/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });

  }


  getMesa( id: number ) {
    return this.http.get(`${this.url}/table/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( resp => {
              return resp['objTable'];
            })
        );
  }

  getMesas(page: number) {
    return this.http.get(`${this.url}/tables?page=${page + 1}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
        // .pipe(
        //     map( resp => this.CreateArrayTable(resp['objTable']['data']))
        // );
  }

  private CreateArrayTable(tablesObj: object ) {
    const tables: TableModel[] = [];
    if (tablesObj === null ) { return []; }
    Object.keys(tablesObj).forEach( key => {
      const table: TableModel = tablesObj[key];
      tables.push(table);
    });
    return tables;
  }
}
