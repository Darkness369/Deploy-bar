import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//Material
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input'
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Componentes
import { FilterPipe } from './pipes/filter.pipe';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { CrearClienteComponent } from './components/crear-cliente/crear-cliente.component';
import { AnalisisInventarioComponent } from './components/analisis-inventario/analisis-inventario.component';
import { InventarioInicialComponent } from './components/inventario-inicial/inventario-inicial.component';
import { RecetasAnalisisComponent } from './components/recetas-analisis/recetas-analisis.component';
import { RecetasComponent } from './components/recetas/recetas.component';
import { BebidasComponent } from './components/bebidas/bebidas.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { DialogComponent } from './shared/dialog/dialog.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LeerExcelComponent } from './components/leer-excel/leer-excel.component';

//Services
import { TokenInterceptorService } from './services/token-interceptor.service';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    SidebarComponent,
    PrincipalComponent,
    CrearClienteComponent,
    AnalisisInventarioComponent,
    InventarioInicialComponent,
    RecetasComponent,
    FilterPipe,
    RecetasAnalisisComponent,
    BebidasComponent,
    VentasComponent,
    DialogComponent,
    ErrorPageComponent,
    LeerExcelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
