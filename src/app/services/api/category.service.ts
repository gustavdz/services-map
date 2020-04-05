import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from '../auth.service';
import {map} from 'rxjs/operators';
import {CategoryModel} from '../../models/category.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private url = environment.baseURL;

  constructor(private http: HttpClient,
              private auth: AuthService) {
    this.auth.leerToken();
  }

  crearCategory(category: CategoryModel) {

    return this.http.post(`${this.url}/category`, category, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map((resp: any) => {
              category.id = resp.id;
              return category;
            })
        );
  }

  actualizarCategory(category: CategoryModel) {

    const categoryTemp = {
      ...category
    };

    delete categoryTemp.id;

    return this.http.put(`${this.url}/category/${category.id}.json`, categoryTemp, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
  }

  borrarCategory(id: number) {
    return this.http.delete(`${this.url}/category/${id}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
  }


  getCategory(id: number) {
    return this.http.get(`${this.url}/category/${id}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map(resp => {
              return resp['objCategory'];
            })
        );
  }

  getCategories(page: number) {
    return this.http.get(`${this.url}/categories?page=${page + 1}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map(resp => this.CreateArrayCategory(resp['objCategory']['data']))
        );
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

}
