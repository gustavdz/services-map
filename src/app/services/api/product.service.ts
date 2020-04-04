import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {CategoryModel} from '../../models/category.model';
import {map} from 'rxjs/operators';
import {ProductModel} from '../../models/product.model';
import {async} from 'rxjs/internal/scheduler/async';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = 'http://localhost:8000/api/v1';
  private urlImage = 'http://localhost:8000/storage/';

  constructor(private http: HttpClient,
              private auth: AuthService) {
    this.auth.leerToken();
  }

  crearProduct( product: ProductModel ) {
    return this.http.post(`${ this.url }/product`, product, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( (resp: any) => {
              product.id = resp.objProduct.id;
              return product;
            })
        );

  }

  actualizarProduct( product: ProductModel ) {

    const productTemp = {
      ...product
    };

    delete productTemp.id;

    return this.http.put(`${ this.url }/product/${ product.id }.json`, productTemp, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });

  }

  borrarProduct( id: number ) {

    return this.http.delete(`${ this.url }/product/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });

  }

  getProduct( id: number ) {
    return this.http.get(`${this.url}/product/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( resp => {
              // this.http.get(`assets/images/products/${resp['objProduct']['id']}.jpg`, {responseType: 'text'})
              //     .subscribe(data => {
              //       // console.log(data);
              //       // resp['objProduct']['image'] = resp['objProduct']['id'].toString();
              //     }, (err) => {
              //       // resp['objProduct']['image'] = 'default';
              //       // console.log(err);
              //     });
              //   console.log(resp['objProduct']['image']);
                resp['objProduct']['image'] = `${ this.urlImage }${resp['objProduct']['image']}`;
              return resp['objProduct'];
            })
        );
  }

  getProducts() {
    return this.http.get(`${this.url}/products`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( resp => this.CreateArrayProduct(resp['objProduct']['data']))
        );
  }

  getProductsBySearch(search: string) {
    return this.http.get(`${this.url}/products?search=${search}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( resp => this.CreateArrayProduct(resp['objProduct']['data']))
        );
  }

  private CreateArrayProduct(productsObj: object ) {
    const products: ProductModel[] = [];
    if (productsObj === null ) { return []; }
    Object.keys(productsObj).forEach( key => {
      const product: ProductModel = productsObj[key];
      product.image = `${this.urlImage}${product.image}`;
      products.push(product);
    });
    return products;
  }
}
