import { Component, OnInit } from '@angular/core';
import {CustomerModel} from '../../models/customer.model';
import {CustomerService} from '../../services/api/customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer: CustomerModel = new CustomerModel();
  customers: CustomerModel[] = [];


  constructor(private customerService: CustomerService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    if ( id > 0 ) {
      this.customerService.getCustomer( id )
          .subscribe( (resp: CustomerModel) => {
            this.customer = resp;
            this.customer.id = id;
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

    if ( this.customer.id > 0 ) {
      peticion = this.customerService.actualizarCustomer( this.customer );
    } else {
      peticion = this.customerService.crearCustomer( this.customer );
    }

    peticion.subscribe( resp => {
      Swal.fire({
        title: this.customer.name,
        text: 'Se guardó correctamente',
        icon: 'success',
      }).then(() => {
        this.router.navigateByUrl('/customers');
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
