import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryComponent } from './pages/categories/category.component';
import { MapComponent } from './pages/map/map.component';
import { TemplateComponent } from './pages/map/template/template.component';

const routes: Routes = [
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: TemplateComponent ,
    children: [
        { path: 'map', component: MapComponent},
        { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
        { path: 'categories/:id', component: CategoryComponent, canActivate: [AuthGuard] },
        { path: '**', redirectTo: '/map', pathMatch: 'prefix' },
        { path: '', redirectTo: '/map', pathMatch: 'prefix' }
      ]
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
