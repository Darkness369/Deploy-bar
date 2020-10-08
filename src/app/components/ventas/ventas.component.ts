import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';

//Services
import { DatosClientes } from '../../../models/clientes';
import { BebidasService } from '../../services/bebidas.service';
import { DatosInventario } from '../../../models/inventario';
import { DatosClientesService } from '../../services/clientes.service';
import { DatosInventarioService } from '../../services/inventario.service';

//Material
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
  providers: [DatosInventarioService, DatosClientesService],
})
export class VentasComponent implements OnInit {
  ELEMENT_DATA: DatosInventario[]=[];
  displayedColumns: string[] = [
    'nombreCli',
    'codBebida',
    'categoria',
    'nombreBebida',
    'ventas',
  ];
  dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);

  constructor(
    private router: Router,
    public datosInventarioService: DatosInventarioService,
    public datosClientesService: DatosClientesService,
    public infoBebibdas: BebidasService
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  editar = true;

  ngOnInit() {
    this.resetFormInv();
    this.resetFormCliente();
    this.refrescarListaInventario();
    this.refrescarListaClientes();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getAllInv();
  }

  /*   getTotalCost() {
    return this.datosInventarioService.DatosInventario.map(t => t.ventas).reduce((acc, value) => acc + value, 0);
  } */

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  idCliente: string;
  selectedid: string = '';
  selectedCliente: string = '';
  direccion: string;
  nombreinv: string;

  categoria = '';
  articulo = '';
  mlText = '';
  mililitros = null;
  cod = null;

  clientSearch(name: string, form) {
    for (let inv of this.datosClientesService.DatosClientes) {
      if (inv.nombre == name) {
        form.value.idCliente = inv._id;
        this.idCliente = inv._id;
      }
    }
  }

  onSubmit(form: NgForm) {
    if (form.value._id == '') {
      form.value.idCliente = this.idCliente;
      form.value.presentacion = this.mililitros;
      form.value.codBebida = this.cod;
      this.datosInventarioService.postDatos(form.value).subscribe((res) => {
        window.alert('Se Guardó Correctamente');
      });
    } else {
      this.datosInventarioService.putDatos(form.value).subscribe((res) => {
        window.alert('Se Actualizo Correctamente');
      });
    }
    this.editar = !this.editar;
  }

  onEdit(inv: DatosInventario) {
    this.datosInventarioService.selectInventario = inv;
    this.mlText = inv.presentacion;
    this.cod = inv.codBebida;
  }

  onDelete(inv: DatosInventario) {
    if (confirm('¿Estás Seguro que deseas eliminarlo?') == true) {
      this.datosInventarioService.deleteDato(inv._id).subscribe((res) => {
        this.getAllInv();
        // this.resetForm(form);
        window.alert('Eliminado Correctamente');
      });
    }
  }

  resetFormCliente(form?: NgForm) {
    if (form) form.reset();
    this.datosClientesService.selectClientes = {
      _id: '',
      nombre: '',
      razonSocial: '',
      rfc: '',
      direccion: '',
      colonia: '',
      estado: '',
      cp: null,
      correo: '',
      telefono: null,
      inventario: [],
      recetas: [],
    };
  }

  resetFormInv(form?: NgForm) {
    if (form) form.reset();
    this.datosInventarioService.selectInventario = {
      _id: '',
      categoria: '',
      nombreBebida: '',
      presentacion: '',
      invInicial: null,
      compras: null,
      ventas: null,
      invFinal: null,
      invTeorico: null,
      diferencia: null,
      codBebida: '',
      idCliente: '',
      nombreCli: '',
      clientes:''
    };
  }

  refrescarListaInventario() {
    this.datosInventarioService.getDatosList().subscribe((res) => {
      this.datosInventarioService.DatosInventario = res as DatosInventario[];
    });
  }

  /* Datos del cliente */
  refrescarListaClientes() {
    this.datosClientesService.getDatosList().subscribe((res) => {
      this.datosClientesService.DatosClientes = res as DatosClientes[];
    });
  }

  getAllInv() {
    let resp = this.datosInventarioService.getDatosList();
    resp.subscribe((res) => (this.dataSource.data = res as DatosInventario[]));
  }

  getCategoria(category: string, form: NgForm) {
    this.categoria = category;
  }

  getArticulo(art: string, form: NgForm) {
    this.articulo = art; //Nombre de la bebida

    for (let drink of this.infoBebibdas.info.drinks) {
      if (art == drink.nombre) {
        this.mililitros = drink.ml;
        this.cod = drink.codigo;
        this.mlText = `${drink.ml} ML`;
      }
    }
  }
}
