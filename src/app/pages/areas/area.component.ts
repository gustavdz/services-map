import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../services/api/area.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-table',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  area: AreaModel = new AreaModel();
  areas: AreaModel[] = [];


  constructor(private areaService: AreaService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    if ( id > 0 ) {
      this.areaService.getArea( id )
          .subscribe( (resp: AreaModel) => {
            this.area = resp;
            this.area.id = id;
          });
    }
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

    if ( this.area.id > 0 ) {
      peticion = this.areaService.actualizarArea( this.area );
    } else {
      peticion = this.areaService.crearArea( this.area );
    }

    peticion.subscribe( resp => {
      Swal.fire({
        title: this.area.name,
        text: 'Se guardó correctamente',
        icon: 'success',
      }).then(() => {
        this.router.navigateByUrl('/areas');
      });
    }, (err) => {
      let message: string;
      if ( err.error.message.name ) {
        message = err.error.message.name[0];
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
