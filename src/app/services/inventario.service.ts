import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { DatosInventario } from '../../models/inventario';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatosInventarioService {

  info: any = [];

  selectInventario: DatosInventario;
  DatosInventario: DatosInventario[];

  // readonly URL = 'http://localhost:3501/inventario'

  // URL_SERVIDOR
  readonly URL = 'https://backend-bar.herokuapp.com/inventario'


  constructor(private http: HttpClient) { 
    this.http.get(this.URL).subscribe((resp: any) => {
    this.info = resp;
  }); }

  postDatos(inventario: any) {
    return this.http.post(this.URL + `/${inventario.idCliente}`, inventario)
  }
   getDatosList() {
    return  this.http.get(this.URL);
  }
  getDatosListInventario() {
    return this.http.get(this.URL).pipe(map (data => data));
    
  }
  putDatos(inv: DatosInventario) {
    return this.http.put(this.URL + `/${inv._id}`, inv);
  }

  putDatosInventarioNuevo(inv) {
    return this.http.put(this.URL + `/inventario/${inv._id}`, inv);
  }

  putDatosNombre(inv: any) {
    return this.http.put(this.URL + `/nombre/${inv._id}`, inv);
  }
  
  deleteDato(_id: string) {
    return this.http.delete(this.URL + `/${_id}`);
  }
}