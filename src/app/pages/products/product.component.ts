import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { NgForm } from '@angular/forms';
import {Observable, pipe} from 'rxjs';
import {ProductModel} from '../../models/product.model';
import {ProductService} from '../../services/api/product.service';
import Swal from 'sweetalert2';
import {CategoryService} from '../../services/api/category.service';
import {CategoryModel} from '../../models/category.model';
import {map, take} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  product: ProductModel = new ProductModel();
  categories: CategoryModel[] = [];
  seleccionado: CategoryModel = new CategoryModel();
  selecetdFile: File;
  imagePreview: string | ArrayBuffer;
  image: string;
  productDefault: string;
  urlImage: string;


  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private route: ActivatedRoute,
              private router: Router,
              private http: HttpClient,
              private auth: AuthService) {
    this.auth.leerToken();
    this.productDefault = `http://localhost:8000/storage/products/default.jpg`;
    this.urlImage = 'http://localhost:8000/api/v1/product/';
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
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    if (id > 0) {
      this.productService.getProduct(id).subscribe(resp => {
        this.product = resp;
        this.product.id = id;
        this.categoryService.getCategories(0)
            .pipe(
                map(res => this.CreateArrayCategory(res['objCategory']['data']))
            )
            .subscribe(res => {
              this.categories = res;
              this.seleccionado.id = this.product.category_id;
              this.seleccionado.name = this.product.category.name;
            });
      });
    } else {
      this.categoryService.getCategories(0)
          .pipe(
              map(resp => this.CreateArrayCategory(resp['objCategory']['data']))
          )
          .subscribe(resp => {
            this.categories = resp;
            this.categories.push({id: 0, name: 'Seleccione...', status: 'A'});
            this.seleccionado.id = 0;
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

    if ( this.product.id ) {
      this.product.category_id = this.seleccionado.id;
      peticion = this.productService.actualizarProduct( this.product );
    } else {
      this.product.category_id = this.seleccionado.id;
      peticion = this.productService.crearProduct( this.product );
    }

    peticion.subscribe( resp => {
      // console.log(resp);
      // console.log(this.product.id);
      if (this.selecetdFile) {
        const uploadData = new FormData();
        uploadData.append('image', this.selecetdFile, this.selecetdFile.name);
        this.http.post(`${this.urlImage}${this.product.id}/upload`, uploadData,
            {headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)}
        ).subscribe( res => {
          console.log(res);
          Swal.fire({
            title: this.product.name,
            text: 'Se guardó correctamente',
            icon: 'success',
          }).then(() => {
            this.router.navigateByUrl('/products');
          });
        }, err => {
          console.log(err);
          Swal.fire({
            title: this.product.name,
            text: 'Ocurrió un error al subir la imagen',
            icon: 'error',
          }).then(() => {
            this.router.navigateByUrl('/products');
          });
        });
      } else {
        Swal.fire({
          title: this.product.name,
          text: 'Se guardó correctamente',
          icon: 'success',
        }).then(() => {
          this.router.navigateByUrl('/products');
        });
      }

    }, (err) => {
      let message: string;
      if ( err.error.message.category_id ) {
        message = err.error.message.category_id[0];
      } else if ( err.error.message.name ) {
        message = err.error.message.name[0];
      } else if ( err.error.message.description ) {
        message = err.error.message.description[0];
      } else if ( err.error.message.price ) {
        message = err.error.message.price[0];
      }
      Swal.fire({
        allowOutsideClick: false,
        text: message,
        icon: 'error',
        title: 'Error al guardar'
      });
    });
  }

  onFileUpload(event) {
    this.selecetdFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selecetdFile);
  }

  OnUploadFile() {
  // Upload file here send a binary data
    const uploadFormData = new FormData();
    uploadFormData.append('image', this.selecetdFile, this.selecetdFile.name);
    this.http.post(`${this.urlImage}${this.product.id}/upload`, uploadFormData,
        {headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)}
        ).subscribe(resp => {
            console.log('success');
            // console.log(resp);
            Swal.fire({
              allowOutsideClick: false,
              text: 'Su imagen fue subida con éxito.',
              icon: 'success',
              title: 'Imagen Guardada'
            });
          }, (err) => {
            console.log('error');
            // console.log(err);
            Swal.fire({
              allowOutsideClick: false,
              text: err.error.message,
              icon: 'error',
              title: 'Error al guardar'
            });
          });
  }
}
