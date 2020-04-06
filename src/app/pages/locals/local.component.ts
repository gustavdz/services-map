import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import {Observable, pipe} from 'rxjs';
import { MarkerModel } from '../../models/marker.model';
import { MarkerService} from '../../services/api/marker.service';
import Swal from 'sweetalert2';
import {CategoryService} from '../../services/api/category.service';
import {CategoryModel} from '../../models/category.model';
import {map, take} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-local',
  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})
export class LocalComponent implements OnInit {
  marker: MarkerModel = new MarkerModel();
  categories: CategoryModel[] = [];
  seleccionado: CategoryModel = new CategoryModel();

  constructor(private markerService: MarkerService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private auth: AuthService) {
    this.auth.leerToken();
  }

  private CreateArrayCategory(categoriesObj: object) {
    const categories: CategoryModel[] = [];
    if (categoriesObj === null) {
      return [];
    }
    Object.keys(categoriesObj).forEach(key => {
      const category: CategoryModel = categoriesObj[key];
      categories.push(category);
    });
    return categories;
  }

  ngOnInit() {
    const id: string = this.route.snapshot.paramMap.get('id');
    if ( id.length > 0 && id !== '0' ) {
      this.markerService.getMarker(id).subscribe(resp => {
        this.marker = resp;
        this.marker._id = id;
        this.categoryService.getCategories()
            .subscribe(res => {
              this.categories = res;
              this.seleccionado._id = this.marker.category._id;
              this.seleccionado.name = this.marker.category.name;
            });
      });
    } else {
      this.categoryService.getCategories()
          .subscribe(resp => {
            this.categories = resp;
            this.categories.push({_id: '0', name: 'Seleccione...', status: 'active'});
            this.seleccionado._id = '0';
            this.seleccionado.name = 'Seleccione...';
          });
    }
  }

  compararNombres( category1: CategoryModel, category2: CategoryModel) {
    if (category1 == null || category2 == null) {
      return false;
    }
    return category1.name === category2.name;
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
    if ( this.marker._id ) {
      this.marker.category_id = this.seleccionado._id;
      peticion = this.markerService.actualizarMarker( this.marker );
    } else {
      this.marker.category_id = this.seleccionado._id;
      peticion = this.markerService.crearMarker( this.marker );
    }
    peticion.subscribe( resp => {
      // console.log(resp);
      // console.log(this.marker.id);
      Swal.fire({
        title: this.marker.name,
        text: 'Se guardó correctamente',
        icon: 'success',
      }).then(() => {
        this.router.navigateByUrl('/services');
      });
    }, (err) => {
      let message: string;
      message = err.error.message,
      Swal.fire({
        allowOutsideClick: false,
        text: message,
        icon: 'error',
        title: 'Error al guardar'
      });
    });
  }
}
