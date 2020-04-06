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
    return this.http.post(`${ this.url }/locals/save`, marker, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    })
        .pipe(
            map( (resp: any) => {
              marker._id = resp._id;
              return marker;
            })
        );
  }

  actualizarMarker( marker: MarkerModel ) {
    const markerTemp = {
      ...marker
    };
    delete markerTemp._id;
    return this.http.put(`${ this.url }/locals/edit/${ marker._id }`, markerTemp, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    });
  }

  borrarMarker( id: string ) {
    return this.http.delete(`${ this.url }/locals/delete/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    });
  }

  getMarker( id: string ) {
    return this.http.get(`${this.url}/locals/get/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    })
        .pipe(
            map( resp => {
              // @ts-ignore
              return resp.local;
            })
        );
  }

  getMarkers() {
    return this.http.get(`${this.url}/locals/get-locals`, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    })
        .pipe(
            map(resp => {
                // @ts-ignore
                return this.CreateArrayMarker(resp.local);
            })
        );
  }

  private CreateArrayMarker(MarkersObj: object) {
    const markers: MarkerModel[] = [];
    if (MarkersObj === null) {
      return [];
    }
    Object.keys(MarkersObj).forEach(key => {
      const marker: MarkerModel = MarkersObj[key];
      markers.push(marker);
    });

    return markers
        .sort( (a, b) => {
          return a.category.name > b.category.name ?
              1 :
              a.name > b.name ?
                  1 :
                  a.name < b.name ?
                      -1 :
                      a.category.name < b.category.name ?
                          -1 :
                          0;
        });
  }
}
