import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CategoryModel} from '../../models/category.model';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {CategoryService} from '../../services/api/category.service';
import Swal from 'sweetalert2';
import * as Feather from 'feather-icons';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MarkerModel} from '../../models/marker.model';
import {MarkerService} from '../../services/api/marker.service';

@Component({
  selector: 'app-locals',
  templateUrl: './locals.component.html',
  styleUrls: ['./locals.component.css']
})
export class LocalsComponent implements AfterViewInit, OnInit {
  markers: MarkerModel[] = [];
  displayedColumns: string[] = ['#', 'name', 'description', 'category', 'options'];
  resultsLength = 0;
  isLoadingResults = true;
  MARKER_DATA: MarkerModel[] = [];
  dataSource = new MatTableDataSource<MarkerModel>(this.MARKER_DATA);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private auth: AuthService,
              private router: Router,
              private markerService: MarkerService) { }

  ngOnInit() {
    this.markerService.getMarkers()
        .subscribe(resp => {
          this.markers = resp;
          this.MARKER_DATA = this.markers;
          this.resultsLength = this.markers.length;
          this.isLoadingResults = false;
          this.dataSource.data = this.MARKER_DATA;
          this.dataSource.paginator = this.paginator;
        }, err => {
          console.log(err);
          this.isLoadingResults = false;
        });
  }

  ngAfterViewInit() {
    Feather.replace();
    this.actualizaTabla();
  }

  private actualizaTabla() {
    merge(this.paginator.page)
        .pipe(
            startWith({}),
            switchMap(() => {
              this.isLoadingResults = true;
              return this.markerService.getMarkers();
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              // console.log(data);
              this.resultsLength = data.length;
              return data;
            }),
            catchError(() => {
              this.isLoadingResults = false;
              // Catch if the GitHub API has reached its rate limit. Return empty data.
              return observableOf([]);
            })
            // @ts-ignore
        ).subscribe(data => this.dataSource = data);
  }

  borrarMarker( marker: MarkerModel, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ marker.name }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.markers.splice(i, 1);
        this.dataSource.data = this.markers;
        this.markerService.borrarMarker( marker._id ).subscribe(() => this.actualizaTabla(), error => {
          // console.log(error.error.message);
          Swal.fire({
            title: 'Error',
            text: `Ocurrió un error al intentar eliminar el local ${ marker.name }.`,
            icon: 'error',
          });
        });
      }
    });
  }

}
