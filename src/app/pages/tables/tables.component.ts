import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import * as Feather from 'feather-icons';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {TableService} from '../../services/api/table.service';
import {TableModel} from '../../models/table.model';
import Swal from 'sweetalert2';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements AfterViewInit, OnInit {
  order: boolean;
  tables: TableModel[] = [];
  displayedColumns: string[] = ['#', 'area', 'name', 'number', 'seats', 'status', 'options'];
  resultsLength = 0;
  isLoadingResults = true;
  TABLE_DATA: TableModel[] = [];
  dataSource = new MatTableDataSource<TableModel>(this.TABLE_DATA);
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private auth: AuthService,
              private router: Router,
              private tableService: TableService) {}

  private CreateArrayTable(tablesObj: object ) {
    if (tablesObj === null ) { return []; }
    Object.keys(tablesObj).forEach( key => {
      const table: TableModel = tablesObj[key];
      this.tables.push(table);
    });
    return this.tables;
  }

  ngOnInit() {
    this.tableService.getMesas(0)
        .pipe(
            map( resp => this.CreateArrayTable(resp['objTable']['data']))
        )
        .subscribe(resp => {
          this.tables = resp;
          this.TABLE_DATA = this.tables;
          this.resultsLength = this.tables.length;
          this.isLoadingResults = false;
          this.dataSource.data = this.TABLE_DATA;
          this.dataSource.paginator = this.paginator;
        }, err => {
          console.log(err);
          this.isLoadingResults = false;
        });
    if (this.router.url === '/orders') {
      this.order = true;
    }
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
              return this.tableService.getMesas(this.paginator.pageIndex);
            }),
            map(data => {
              // Flip flag to show that loading has finished.
              this.isLoadingResults = false;

              // console.log(data);
              this.resultsLength = data['objTable']['total'];

              return data['objTable']['data'];
            }),
            catchError(() => {
              this.isLoadingResults = false;
              // Catch if the GitHub API has reached its rate limit. Return empty data.
              return observableOf([]);
            })
        ).subscribe(data => this.dataSource = data);
  }

  borrarMesa( table: TableModel, i: number ) {
    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ table.name }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if ( resp.value ) {
        this.tables.splice(i, 1);
        this.dataSource.data = this.tables;
        this.tableService.borrarMesa( table.id ).subscribe(() => this.actualizaTabla(), error => {
          // console.log(error.error.message);
          Swal.fire({
            title: 'Error',
            text: `Ocurrió un error al intentar eliminar la categoría ${ table.name }.`,
            icon: 'error',
          });
        });
      }
    });
  }
}
