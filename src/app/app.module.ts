import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from './pipes/truncate.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatCardModule, MatCheckboxModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule, MatSidenavModule,
    MatTableModule, MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RegistroComponent } from './pages/registro/registro.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryComponent } from './pages/categories/category.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MapComponent } from './pages/map/map.component';
import {AgmCoreModule} from '@agm/core';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';
import { TemplateComponent } from './pages/template/template.component';
import { environment } from '../environments/environment';
import { LocalsComponent } from './pages/locals/locals.component';
import { LocalComponent } from './pages/locals/local.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    CategoriesComponent,
    CategoryComponent,
    TruncatePipe,
    MapComponent,
    TemplateComponent,
    LocalsComponent,
    LocalComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        InfiniteScrollModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatTableModule,
        MatTooltipModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        DragDropModule,
        AgmCoreModule.forRoot({
            apiKey: environment.APIKeys.GoogleMapsAPIKey
        }),
        AgmJsMarkerClustererModule,
        FontAwesomeModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
