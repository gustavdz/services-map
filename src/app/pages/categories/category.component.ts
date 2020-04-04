import { Component, OnInit } from '@angular/core';
import {CategoryModel} from '../../models/category.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';
import {CategoryService} from '../../services/api/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  category: CategoryModel = new CategoryModel();
  categories: CategoryModel[] = [];


  constructor(private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    if ( id > 0 ) {
      this.categoryService.getCategory( id )
          .subscribe( (resp: CategoryModel) => {
            this.category = resp;
            this.category.id = id;
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

    if ( this.category.id > 0 ) {
      peticion = this.categoryService.actualizarCategory( this.category );
    } else {
      peticion = this.categoryService.crearCategory( this.category );
    }

    peticion.subscribe( resp => {
      Swal.fire({
        title: this.category.name,
        text: 'Se guardó correctamente',
        icon: 'success',
      }).then(() => {
        this.router.navigateByUrl('/categories');
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
