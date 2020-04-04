import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TablesComponent} from './pages/tables/tables.component';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import {AuthGuard} from './guards/auth.guard';
import {TableComponent} from './pages/tables/table.component';
import {AreasComponent} from './pages/areas/areas.component';
import {AreaComponent} from './pages/areas/area.component';
import {CategoriesComponent} from './pages/categories/categories.component';
import {ProductsComponent} from './pages/products/products.component';
import {CategoryComponent} from './pages/categories/category.component';
import {ProductComponent} from './pages/products/product.component';
import {CustomersComponent} from './pages/customers/customers.component';
import {CustomerComponent} from './pages/customers/customer.component';
import {OrdersComponent} from './pages/orders/orders.component';
import {OrderComponent} from './pages/orders/order.component';
import {MainComponent} from './pages/main/main.component';
import {ContainerComponent} from './pages/container/container.component';
import {MapComponent} from './pages/map/map.component';
import {TemplateComponent} from './pages/map/template/template.component';


const routes: Routes = [
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'template2', component: ContainerComponent},
  { path: '', component: TemplateComponent ,
    children: [
      { path: 'map', component: MapComponent},
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegistroComponent },
      { path: '**', redirectTo: '/map', pathMatch: 'full' },
      { path: '', redirectTo: '/map', pathMatch: 'full' }
      ]
  },
  // { path: '', component: MainComponent,
  //   children: [
  //     { path: 'tables', component: TablesComponent, canActivate: [AuthGuard] },
  //     { path: 'tables/:id', component: TableComponent, canActivate: [AuthGuard] },
  //     { path: 'areas', component: AreasComponent, canActivate: [AuthGuard] },
  //     { path: 'areas/:id', component: AreaComponent, canActivate: [AuthGuard] },
  //     { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  //     { path: 'categories/:id', component: CategoryComponent, canActivate: [AuthGuard] },
  //     { path: 'products', component: ProductsComponent, canActivate: [AuthGuard] },
  //     { path: 'products/:id', component: ProductComponent, canActivate: [AuthGuard] },
  //     { path: 'customers', component: CustomersComponent, canActivate: [AuthGuard] },
  //     { path: 'customers/:id', component: CustomerComponent, canActivate: [AuthGuard] },
  //     { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  //     { path: 'orders/:id', component: OrderComponent, canActivate: [AuthGuard] },
  //     { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  //     { path: '', redirectTo: 'home', pathMatch: 'prefix' }
  //   ]
  // }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
