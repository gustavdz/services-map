import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import {TableModel} from '../../models/table.model';
import {TableService} from '../../services/api/table.service';
import Swal from 'sweetalert2';
import {AreaService} from '../../services/api/area.service';
import {AreaModel} from '../../models/area.model';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  table: TableModel = new TableModel();
  areas: AreaModel[] = [];
  seleccionado: AreaModel = new AreaModel();


  constructor(private tableService: TableService,
              private areaService: AreaService,
              private route: ActivatedRoute,
              private router: Router) {
  }
  private CreateArrayArea(areasObj: object ) {
    if (areasObj === null ) { return []; }
    Object.keys(areasObj).forEach( key => {
      const area: TableModel = areasObj[key];
      this.areas.push(area);
    });
    return this.areas;
  }

  ngOnInit() {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    if ( id > 0 ) {
      this.tableService.getMesa( id )
          .subscribe( (resp: TableModel) => {
            this.table = resp;
            this.table.id = id;
            this.areaService.getAreas(0)
                .pipe(
                    map( resp => this.CreateArrayArea(resp['objArea']['data']))
                )
                .subscribe(res => {
                  this.areas = res;
                  this.seleccionado.id = this.table.area_id;
                  this.seleccionado.name = this.table.area.name;
                });
          });
    } else {
      this.areaService.getAreas(0)
          .pipe(
              map( resp => this.CreateArrayArea(resp['objArea']['data']))
          )
          .subscribe(resp => {
            this.areas = resp;
            this.areas.push({id: 0, name: 'Seleccione...', status: 'A'});
            this.seleccionado.id = 0;
            this.seleccionado.name = 'Seleccione...';
          });
    }

  }

  compararNombres( area1: AreaModel, area2: AreaModel) {
    if (area1 == null || area2 == null) {
      return false;
    }
    return area1.name === area2.name;
  }

  guardar( form: NgForm ) {

    if ( form.invalid ) {
      console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();


    let peticion: Observable<any>;

    if ( this.table.id ) {
      this.table.area_id = this.seleccionado.id;
      peticion = this.tableService.actualizarMesa( this.table );
    } else {
      this.table.area_id = this.seleccionado.id;
      peticion = this.tableService.crearMesa( this.table );
    }

    peticion.subscribe( resp => {
      Swal.fire({
        title: this.table.name,
        text: 'Se guardó correctamente',
        icon: 'success',
      }).then(() => {
        this.router.navigateByUrl('/tables');
      });

    }, (err) => {
      let message: string;
      if ( err.error.message.area_id ) {
        message = err.error.message.area_id[0];
      } else if ( err.error.message.name ) {
        message = err.error.message.name[0];
      } else if ( err.error.message.number ) {
        message = err.error.message.number[0];
      } else if ( err.error.message.seats ) {
        message = err.error.message.seats[0];
      }
      Swal.fire({
        allowOutsideClick: false,
        text: message,
        icon: 'error',
        title: 'Error al guardar'
      });
    });



  }

}
