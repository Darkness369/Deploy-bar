import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { CrearClienteComponent } from './components/crear-cliente/crear-cliente.component';
import { AnalisisInventarioComponent } from './components/analisis-inventario/analisis-inventario.component';
import { InventarioInicialComponent } from './components/inventario-inicial/inventario-inicial.component';
import { RecetasAnalisisComponent }     from './components/recetas-analisis/recetas-analisis.component';
import { HttpClientModule } from '@angular/common/http';
import { RecetasComponent } from './components/recetas/recetas.component';
import { BebidasComponent } from './components/bebidas/bebidas.component';
import { VentasComponent } from './components/ventas/ventas.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { LeerExcelComponent } from './components/leer-excel/leer-excel.component';

// Seguridad
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {path: 'registro',component: RegistroComponent},
  {path: 'error',component: ErrorPageComponent},
  {path: 'login',component: LoginComponent},
  {path: 'principal',component: PrincipalComponent,canActivate:[AuthGuard]},
  {path: 'clientes',component: CrearClienteComponent,canActivate:[AuthGuard]},
  {path: 'recetas',component: RecetasComponent,canActivate:[AuthGuard]},
  {path: 'analisis',component: AnalisisInventarioComponent },
  {path: 'analisisRecetas',component: RecetasAnalisisComponent,canActivate:[AuthGuard] },
  {path: 'inventario',component:  InventarioInicialComponent,canActivate:[AuthGuard] },
  {path: 'bebidas',component:  BebidasComponent,canActivate:[AuthGuard] },
  {path: 'ventas',component:  VentasComponent,canActivate:[AuthGuard] },
  {path: 'excel',component:  LeerExcelComponent,canActivate:[AuthGuard] },
  {path: '', pathMatch:'full', redirectTo:'login' },
  {path: '**',  pathMatch:'full', redirectTo:'error'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes),HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
