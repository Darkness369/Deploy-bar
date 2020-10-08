import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class PermisosService {

  // readonly URL = 'http://localhost:3501/api/profile';

  // URL_SERVIDOR
  readonly URL = 'https://backend-bar.herokuapp.com/api/profile';


  // permisos:any = {};
  usuarios: any = [];

  constructor(private http: HttpClient) {
  }

  getUsuarios() {
    return this.http.get(this.URL);
  }

  putDatos(cliente: any) {
    return this.http.put(this.URL + `/${cliente.id}`, cliente);
  }
  putDatosChanges(cliente: any) {
    return this.http.put(this.URL + `/userChanges/${cliente._id}`, cliente);
  }
  putDatosDelete(cliente: any) {
    return this.http.put(this.URL + `/delete/${cliente._id}`, cliente);
  }

}
