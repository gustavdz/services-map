import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import {ProductService} from '../../services/api/product.service';
import {ProductModel} from '../../models/product.model';
import * as Feather from 'feather-icons';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, AfterViewInit {
  products: ProductModel[] = [];

  private productsToShow: ProductModel[];
  private showGoUpButton: boolean;
  private showMoreButton: boolean;
  showScrollHeight = 400;
  hideScrollHeight = 200;
  productCounter = 0;
  productIndex = 0;

  constructor(private auth: AuthService,
              private router: Router,
              private productService: ProductService) {
    this.showGoUpButton = false;
    this.showMoreButton = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (( window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true;
    } else if ( this.showGoUpButton &&
        (window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop)
        < this.hideScrollHeight) {
      this.showGoUpButton = false;
    }
  }

  ngOnInit() {
    this.productService.getProducts()
        .subscribe(resp  => {
          this.products = resp;
          this.productCounter = this.products.length;
          this.productsToShow = new Array<ProductModel>();
          this.addlines();
        });
  }

  ngAfterViewInit() {
    Feather.replace();
  }

  loadMore() {
    if (this.productIndex < this.productCounter - 1) {
      this.addlines();
    } else {
      console.log ('No hay más productos que mostrar.');
    }
  }

  addlines() {
    for (let i = 0; i < 12; i ++) {
      if (this.productIndex < this.productCounter) {
        this.productsToShow.push(this.products[this.productIndex]);
        this.productIndex += 1;
      } else {
        this.showMoreButton = false;
        stop();
      }
    }
  }

  onScroll() {
    if (this.productIndex < this.productCounter - 1) {
      this.addlines();
    } else {
      console.log ('No hay más productos que mostrar.');
    }
  }

  scrollTop() {
    document.body.scrollTop = 0; // Safari
    document.documentElement.scrollTop = 0; // Other
  }

  borrarProduct( product: ProductModel, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ product.name }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.products.splice(i, 1);
        this.productsToShow.splice(i, 1);
        this.productService.borrarProduct( product.id ).subscribe();
      }
    });
  }
}
