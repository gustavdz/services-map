import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {CustomerModel} from '../../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private url = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient,
              private auth: AuthService) {
    this.auth.leerToken();
  }

  crearCustomer( customer: CustomerModel ) {
    return this.http.post(`${ this.url }/customer`, customer, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( (resp: any) => {
              customer.id = resp.id;
              return customer;
            })
        );
  }

  actualizarCustomer( customer: CustomerModel ) {
    const customerTemp = {
      ...customer
    };
    delete customerTemp.id;
    return this.http.put(`${ this.url }/customer/${ customer.id }.json`, customerTemp, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
  }

  borrarCustomer( id: number ) {
    return this.http.delete(`${ this.url }/customer/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
  }

  getCustomer( id: number ) {
    return this.http.get(`${this.url}/customer/${ id }`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    })
        .pipe(
            map( resp => {
              return resp['objCustomer'];
            })
        );
  }

  getCustomers(page: number) {
    return this.http.get(`${this.url}/customers?page=${page + 1}`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.auth.userToken}`)
    });
  }

  private CreateArrayCustomer(customersObj: object ) {
    const customers: CustomerModel[] = [];
    if (customersObj === null ) { return []; }
    Object.keys(customersObj).forEach( key => {
      const customer: CustomerModel = customersObj[key];
      customers.push(customer);
    });
    return customers;
  }

}
