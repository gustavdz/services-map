import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { MarkerModel } from '../../models/marker.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  private url = environment.baseURL;

  constructor(private http: HttpClient,
              private auth: AuthService) {
    this.auth.leerToken();
  }

  crearMarker( marker: MarkerModel ) {
    return this.http.post(`${ this.url }/marker`, marker, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( (resp: any) => {
              marker.id = resp.id;
              return marker;
            })
        );
  }

  actualizarMarker( marker: MarkerModel ) {
    const markerTemp = {
      ...marker
    };
    delete markerTemp.id;
    return this.http.put(`${ this.url }/marker/${ marker.id }.json`, markerTemp, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
  }

  borrarMarker( id: number ) {
    return this.http.delete(`${ this.url }/marker/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
  }

  getMarker( id: number ) {
    return this.http.get(`${this.url}/marker/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( resp => {
              return resp['objMarker'];
            })
        );
  }

  getMarkers() {
    return this.http.get(`${this.url}/customers`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map(resp => this.CreateArrayMarker(resp['objMarker']['data']))
        );
  }

  private CreateArrayMarker(markersObj: object ) {
    const markers: MarkerModel[] = [];
    if (markersObj === null ) { return []; }
    Object.keys(markersObj).forEach( key => {
      const marker: MarkerModel = markersObj[key];
      markers.push(marker);
    });
    return markers;
  }
}
