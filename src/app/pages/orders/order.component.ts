import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TableModel} from '../../models/table.model';
import {AreaModel} from '../../models/area.model';
import {TableService} from '../../services/api/table.service';
import {AreaService} from '../../services/api/area.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import Swal from 'sweetalert2';
import {Observable} from 'rxjs';
import {ProductService} from '../../services/api/product.service';
import {ProductModel} from '../../models/product.model';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  products: ProductModel[] = [];
  currentOrder: ProductModel[] = [];
  currentAmount: number;

  constructor(private auth: AuthService,
              private router: Router,
              private productService: ProductService) {
    this.currentAmount = 0.00;
  }

  ngOnInit() {
    this.productService.getProducts()
        .subscribe(resp  => {
          this.products = resp;
          // console.log(this.products);
        });
  }

  getProducts(search: string) {
    // console.log(search);
    this.productService.getProductsBySearch(search).subscribe(resp => {
      this.products = resp;
      // console.log(this.products.indexOf(this.currentOrder[0]));
    });
  }
  calculatePrice(element: ProductModel, operation) {
    if (operation === 'add') {
      this.currentAmount = this.currentAmount + parseFloat(element.price.toString());
    } else {
      this.currentAmount = this.currentAmount - parseFloat(element.price.toString());
    }
    // console.log(this.currentAmount);
  }

  moveItem( i: number) {
    this.currentOrder.push(this.products[i]);
    this.calculatePrice(this.products[i], 'add');
    this.products.splice(i, 1);
    // this.products.sort((a, b) => (a.id > b.id) ? 1 : -1);
  }

  add(arr, element) {
    const found = arr.some(el => el.name === element.name);
    if (!found) {
      arr.push(element);
    }
    return arr;
  }

  deleteItem( i: number) {
    this.add(this.products, this.currentOrder[i]);
    // this.products.push(this.currentOrder[i]);
    this.calculatePrice(this.currentOrder[i], 'rest');
    this.currentOrder.splice(i, 1);
    this.products.sort((a, b) => (a.id > b.id) ? 1 : -1);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
    }
  }

}
