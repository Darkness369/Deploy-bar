import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatosBebidas } from '../../models/bebidas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BebidasService {
  // readonly URL = 'http://localhost:3501/bebidas';

  // URL_SERVIDOR
  readonly URL = 'https://backend-bar.herokuapp.com/bebidas';

  info: any = [];

  selectBebida: DatosBebidas;
  DatosBebidas: DatosBebidas[];

  constructor(private http: HttpClient) {
    this.http.get(this.URL).subscribe((resp: any) => {
      this.info = resp;
    });
  }
  postDatos(bebida: any) {
    return this.http.post(this.URL, bebida);
  }

  getDatosList() {
    return this.http.get(this.URL);
  }

  putDatos(beb: DatosBebidas) {
    return this.http.put(this.URL + `/${beb._id}`, beb);
  }
  deleteDato(_id: string) {
    return this.http.delete(this.URL + `/${_id}`);
  }
}
