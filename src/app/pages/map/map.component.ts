import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { MouseEvent } from '@agm/core';
import { MarkerModel} from '../../models/marker.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
// initial center position
  lat = -2.1392795;
  lng = -79.8837898;
// google maps zoom
  zoom = 14;
  options = {
    imagePath: 'https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclustererplus/images/m'
  };
  markers: MarkerModel[] = [
    {
      lat: -2.1430786,
      lng: -79.9002385,
      label: 'Cafeteria',
      name: 'CafeTest',
      description: 'Cafetería ecuatoriana con café tostado y molido por nuestras propias manos ' +
          'y expertos cafeteros que seleccionan grano por grano nuestro producto para brindarles el mejor café',
      draggable: false
    },
    {
      lat: -2.1420786,
      lng: -79.9002385,
      label: 'Cafeteria 2',
      name: 'CafePrueba',
      description: 'Cafetería colombiana con café tostado y molido por nuestras propias manos ' +
          'y expertos cafeteros que seleccionan grano por grano nuestro producto para brindarles el mejor café',
      draggable: false
    },
    {
      lat: -2.1327432,
      lng: -79.8658955,
      label: 'UEES',
      name: 'Universidad de Especialidades Espíritu Santo',
      description: 'La Universidad de Especialidades Espíritu Santo actualmente cuenta con alrededor de 5.000 ' +
          'estudiantes. Tiene diez facultades y 51 carreras (entre Pregrado y Postgrado).',
      draggable: false
    },
    {
      lat: -2.0393249,
      lng: -79.8568404,
      label: 'Redlinks',
      name: 'Redlinks S.A.',
      description: 'brindamos un servicio integral en soluciones de seguridad e identiﬁcación educativa y empresarial en Guayaquil. ' +
          'Proveemos credenciales PVC para empresas, carnets estudiantiles, tecnología en identificación y sistemas de acceso, video ' +
          'vigilancia y seguridad electrónica.',
      draggable: false
    },
    {
      lat: -2.1340284,
      lng: -79.8967307,
      label: 'Restaurante 2',
      name: 'El Pollo Pelucón',
      description: 'Local de comida típica ecuatoriana, con excelente sazón ',
      draggable: false
    }
  ];
  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: false,
      name: '',
      description: ''
    });
  }

  markerDragEnd(m: MarkerModel, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
}
