import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { MouseEvent } from '@agm/core';
import { MarkerModel} from '../../models/marker.model';
import {MarkerService} from '../../services/api/marker.service';

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
  markers: MarkerModel[] = [];
  isLoadingResults = true;

  constructor(private auth: AuthService,
              private router: Router,
              private markerService: MarkerService) { }

  ngOnInit() {
    this.markerService.getMarkers()
        .subscribe(resp => {
          this.markers = resp;
          this.isLoadingResults = false;
        }, err => {
          console.log(err);
          this.isLoadingResults = false;
        });
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  markerDragEnd(m: MarkerModel, $event: MouseEvent) {
    console.log('dragEnd', m, $event);
  }
}
