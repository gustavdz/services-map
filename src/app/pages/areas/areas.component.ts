import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as Feather from 'feather-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AreaModel } from '../../models/area.model';
import Swal from 'sweetalert2';
import {AreaService} from '../../services/api/area.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.css']
})
export class AreasComponent implements AfterViewInit, OnInit {
  areas: AreaModel[] = [];
  displayedColumns: string[] = ['#', 'name', 'status', 'options'];
  resultsLength = 0;
  isLoadingResults = true;
  AREA_DATA: AreaModel[] = [];
  dataSource = new MatTableDataSource<AreaModel>(this.AREA_DATA);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private auth: AuthService,
              private router: Router,
              private areaService: AreaService) { }

  private CreateArrayArea(areasObj: object ) {
    if (areasObj === null ) { return []; }
    Object.keys(areasObj).forEach( key => {
      const area: AreaModel = areasObj[key];
      this.areas.push(area);
    });
    return this.areas;
  }

  ngOnInit() {
    this.areaService.getAreas(0)
        .pipe(
            map( resp => this.CreateArrayArea(resp['objArea']['data']))
        )
        .subscribe(resp => {
          this.areas = resp;
          this.AREA_DATA = this.areas;
          this.resultsLength = this.areas.length;
          this.isLoadingResults = false;
          this.dataSource.data = this.AREA_DATA;
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
              return this.areaService.getAreas(this.paginator.pageIndex);
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;

              // console.log(data);
              this.resultsLength = data['objArea']['total'];

              return data['objArea']['data'];
            }),
            catchError(() => {
              this.isLoadingResults = false;
              // Catch if the GitHub API has reached its rate limit. Return empty data.
              return observableOf([]);
            })
        ).subscribe(data => this.dataSource = data);
  }

  borrarArea( area: AreaModel, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ area.name }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.areas.splice(i, 1);
        this.dataSource.data = this.areas;
        this.areaService.borrarArea( area.id ).subscribe(() => this.actualizaTabla(), error => {
          // console.log(error.error.message);
          Swal.fire({
            title: 'Error',
            text: `Ocurrió un error al intentar eliminar la categoría ${ area.name }.`,
            icon: 'error',
          });
        });
      }
    });



  }

}
