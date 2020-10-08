import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { DatosClientes } from '../../models/clientes';

@Injectable({
  providedIn: 'root'
})
export class DatosClientesService {

  selectClientes: DatosClientes;
  DatosClientes: DatosClientes[];

  // readonly URL = 'http://localhost:3501/clientes';

  // URL_SERVIDOR
  readonly URL = 'https://backend-bar.herokuapp.com/clientes';


  constructor(private http: HttpClient) { }

  postDatos(cliente: DatosClientes) {
    return this.http.post(this.URL, cliente)
  }
  getDatosList() {
    return this.http.get(this.URL);
  }

  putDatos(clt: DatosClientes) {
    return this.http.put(this.URL + `/${clt._id}`, clt);
  }
  deleteDato(_id: string) {
    return this.http.delete(this.URL + `/${_id}`);
  }
}