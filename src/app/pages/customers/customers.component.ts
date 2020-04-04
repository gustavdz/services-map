import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as Feather from 'feather-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CustomerModel } from '../../models/customer.model';
import Swal from 'sweetalert2';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {CustomerService} from '../../services/api/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements AfterViewInit, OnInit {
  customers: CustomerModel[] = [];
  displayedColumns: string[] = ['#', 'name', 'email', 'phone', 'address', 'comments', 'options'];
  resultsLength = 0;
  isLoadingResults = true;
  CUSTOMER_DATA: CustomerModel[] = [];
  dataSource = new MatTableDataSource<CustomerModel>(this.CUSTOMER_DATA);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private auth: AuthService,
              private router: Router,
              private customerService: CustomerService) { }

  private CreateArrayCustomer(customersObj: object ) {
    if (customersObj === null ) { return []; }
    Object.keys(customersObj).forEach( key => {
      const customer: CustomerModel = customersObj[key];
      this.customers.push(customer);
    });
    return this.customers;
  }

  ngOnInit() {
    this.customerService.getCustomers(0)
        .pipe(
            map( resp => this.CreateArrayCustomer(resp['objCustomer']['data']))
        )
        .subscribe(resp => {
          this.customers = resp;
          this.CUSTOMER_DATA = this.customers;
          this.resultsLength = this.customers.length;
          this.isLoadingResults = false;
          this.dataSource.data = this.CUSTOMER_DATA;
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
              return this.customerService.getCustomers(this.paginator.pageIndex);
            }),
            map(data => {
              this.isLoadingResults = false;
              this.resultsLength = data['objCustomer']['total'];
              return data['objCustomer']['data'];
            }),
            catchError(() => {
              this.isLoadingResults = false;
              return observableOf([]);
            })
        ).subscribe(data => this.dataSource = data);
  }

  borrarCustomer( customer: CustomerModel, i: number ) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ customer.name }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.customers.splice(i, 1);
        this.dataSource.data = this.customers;
        this.customerService.borrarCustomer( customer.id ).subscribe(() => this.actualizaTabla(), error => {
          Swal.fire({
            title: 'Error',
            text: `Ocurrió un error al intentar eliminar el cliente ${ customer.name }.`,
            icon: 'error',
          });
        });
      }
    });
  }
}
