import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {CategoryModel} from '../../models/category.model';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {CategoryService} from '../../services/api/category.service';
import Swal from 'sweetalert2';
import * as Feather from 'feather-icons';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements AfterViewInit, OnInit {
  categories: CategoryModel[] = [];
  displayedColumns: string[] = ['#', 'name', 'status', 'options'];
  resultsLength = 0;
  isLoadingResults = true;
  CATEGORY_DATA: CategoryModel[] = [];
  dataSource = new MatTableDataSource<CategoryModel>(this.CATEGORY_DATA);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private auth: AuthService,
              private router: Router,
              private categoryService: CategoryService) { }

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
    this.categoryService.getCategories(0)
        .pipe(
            map( resp => this.CreateArrayCategory(resp['objCategory']['data']))
        )
        .subscribe(resp => {
          this.categories = resp;
          this.CATEGORY_DATA = this.categories;
          this.resultsLength = this.categories.length;
          this.isLoadingResults = false;
          this.dataSource.data = this.CATEGORY_DATA;
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
              return this.categoryService.getCategories(this.paginator.pageIndex);
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;
              // console.log(data);
              this.resultsLength = data['objCategory']['total'];

              return data['objCategory']['data'];
            }),
            catchError(() => {
              this.isLoadingResults = false;
              // Catch if the GitHub API has reached its rate limit. Return empty data.
              return observableOf([]);
            })
        ).subscribe(data => this.dataSource = data);
  }

  borrarCategory( category: CategoryModel, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ category.name }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.categories.splice(i, 1);
        this.dataSource.data = this.categories;
        this.categoryService.borrarCategory( category.id ).subscribe(() => this.actualizaTabla(), error => {
          // console.log(error.error.message);
          Swal.fire({
            title: 'Error',
            text: `Ocurrió un error al intentar eliminar la categoría ${ category.name }.`,
            icon: 'error',
          });
        });
      }
    });
  }
}
