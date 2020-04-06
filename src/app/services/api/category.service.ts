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

    return this.http.post(`${this.url}/category/save`, category, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    })
        .pipe(
            map((resp: any) => {
              category._id = resp._id;
              return category;
            })
        );
  }

  actualizarCategory(category: CategoryModel) {

    const categoryTemp = {
      ...category
    };

    delete categoryTemp._id;

    return this.http.put(`${this.url}/category/edit/${category._id}`, categoryTemp, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    });
  }

  borrarCategory(id: string) {
    return this.http.delete(`${this.url}/category/delete/${id}`, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    });
  }


  getCategory(id: string) {
    return this.http.get(`${this.url}/category/get/${id}`, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    })
        .pipe(
            map(resp => {
              // @ts-ignore
              return resp.category;
            })
        );
  }

  getCategories() {
    return this.http.get(`${this.url}/category/get-categories`, {
      headers: new HttpHeaders().set('Authorization', `${this.auth.userToken}`)
    })
        .pipe(
            map(resp => {
              // @ts-ignore
              return this.CreateArrayCategory(resp.categories);
            })
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

    return categories.sort( (a, b) => {
      return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
    });
  }

}
