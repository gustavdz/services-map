import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {AreaModel} from '../../models/area.model';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  private url = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient,
              private auth: AuthService) {
    this.auth.leerToken();
  }

  crearArea( area: AreaModel ) {

    return this.http.post(`${ this.url }/area`, area, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( (resp: any) => {
              area.id = resp.id;
              return area;
            })
        );

  }

  actualizarArea( area: AreaModel ) {

    const areaTemp = {
      ...area
    };

    delete areaTemp.id;

    return this.http.put(`${ this.url }/area/${ area.id }.json`, areaTemp, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });


  }

  borrarArea( id: number ) {

    return this.http.delete(`${ this.url }/area/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });

  }


  getArea( id: number ) {
    return this.http.get(`${this.url}/area/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( resp => {
              return resp['objArea'];
            })
        );
  }

  getAreas(page: number) {
    return this.http.get(`${this.url}/areas?page=${page + 1}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
        // .pipe(
        //     map( resp => this.CreateArrayArea(resp['objArea']['data']))
        // );
  }

  private CreateArrayArea(areasObj: object ) {
    const areas: AreaModel[] = [];
    if (areasObj === null ) { return []; }
    Object.keys(areasObj).forEach( key => {
      const area: AreaModel = areasObj[key];
      areas.push(area);
    });
    return areas;
  }
}
