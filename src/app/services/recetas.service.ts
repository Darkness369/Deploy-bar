import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { DatosRecetas } from '../../models/recetas';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {

  selectReceta: DatosRecetas;
  DatosReceta: DatosRecetas[];

  // readonly URL = 'http://localhost:3501/recetas';

  // URL_SERVIDOR
  readonly URL = 'https://backend-bar.herokuapp.com/recetas';


  constructor(private http: HttpClient) { }

  postDatos(receta: any) {
    return this.http.post(this.URL + `/${receta.idCliente}`, receta)
  }
  getDatosList() {
    return this.http.get(this.URL);
  }

  putDatos(rec: DatosRecetas) {
    return this.http.put(this.URL + `/${rec._id}`, rec);
  }
  deleteDato(_id: string) {
    return this.http.delete(this.URL + `/${_id}`);
  }
}