import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';

//Services
import { AuthService } from '../../services/auth.service';
import { ExcelService } from '../../services/sub-services/excel.service';
import { BebidasService } from '../../services/bebidas.service';
import { PermisosService } from '../../services/permisos.service';
import { DatosClientesService } from '../../services/clientes.service';
import { DatosInventarioService } from '../../services/inventario.service';


import { HttpClient } from '@angular/common/http'
//Models
import { DatosClientes } from '../../../models/clientes';
import { DatosInventario } from '../../../models/inventario';

//Material
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';



@Component({
  selector: 'app-analisis-inventario',
  templateUrl: './analisis-inventario.component.html',
  styleUrls: [
    './analisis-inventario.component.css',
    './tablas-inventario.component.css',
  ],
  providers: [DatosInventarioService, DatosClientesService, BebidasService],
})
export class AnalisisInventarioComponent implements OnInit {


  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;


  ELEMENT_DATA: DatosInventario[] = [];
  displayedColumns: string[] = [
    'nombreCli',
    'codBebida',
    'categoria',
    'nombreBebida',
    'presentacion',
    'invInicial',
    'compras',
    'ventas',
    'invTeorico',
    'invFinal',
    'diferencia',
    'Editar',
    'eliminar',
  ];


  dataSource = new MatTableDataSource<DatosInventario>(this.ELEMENT_DATA);


  editar = true;
  vventa = true;
  excel: string = '';

  usuarios: any = [];
  usserLogged: any;

  permiso: boolean;
  dia: number;

  categoria = '';
  articulo = '';
  mlText = '';
  mililitros = null;
  cod = null;

  idCliente: string;
  selectedId: string = '';
  selectedCliente: string = '';

  inventarios: any[];


  day = new Date();

  constructor(
    public datosInventarioService: DatosInventarioService,
    public excelService: ExcelService,
    public datosClientesService: DatosClientesService,
    public bebidaService: BebidasService,
    public users: PermisosService,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private dialogo: MatDialog
  ) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;



  permisoUsuario = {
    _id: '',
    fecha: null,
    changes: null,
    deletes: null,
    permisos: null,
  };

  ngOnInit() {
    this.usserLogged = this.authService.getUserLoggedIn();
    this.resetFormInv();
    this.resetFormCliente();
    this.refrescarListaInventario();
    this.refrescarListaClientes();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.Verificar();
    this.dia = this.day.getDate();


  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  Verificar() {
    this.users.getUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
      for (let usuario of this.usuarios) {
        if (usuario.email == this.usserLogged) {
          this.capturar(
            usuario.changes,
            usuario.deletes,
            usuario._id,
            usuario.permisos
          );
        }
      }
    });
  }

  capturar(changes, deletes, id, permisos) {
    this.permisoUsuario._id = id;
    this.permisoUsuario.changes = changes;
    this.permisoUsuario.deletes = deletes;
    this.permisoUsuario.permisos = permisos;
    //console.log(this.permisoUsuario.permisos);
  }

  clientSearch(name: string, form) {
    for (let inv of this.datosClientesService.DatosClientes) {
      if (inv.nombre == name) {
        this.excel = inv.nombre;
        form.value.idCliente = inv._id;
        this.idCliente = inv._id;
        this.selectedId = inv._id;
      }
    }
  }

  generarExcel(): void {
    if (this.excel == '') {
      this.excel = 'Inventarios';
    }
    this.excelService.exportToExcel(this.dataSource.filteredData, this.excel);
  }

  applyFilter(filterValue: string) {
    this.getAllInv();
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.excel = filterValue;
    this.excelService.guardarNombreCliente(this.selectedCliente);
  }


  editAll(form: NgForm) {
    this.dialogo
      .open(DialogComponent, {
        data: `Seguro que quieres hacer nuevo inventario basado en el anterior de ${this.selectedCliente}, se hará  una copia inventarios de ${this.selectedCliente} en excel`
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
        const nombre = form.value.nombre.toLowerCase();

        this.datosInventarioService.getDatosListInventario().subscribe((data: any) => {
          this.inventarios = data;

        this.generarExcel();
        for (let inv of this.inventarios) {

          if (nombre == inv.nombreCli.toLowerCase()) {

            inv.invInicial = inv.invFinal;
            inv.compras = 0;
            inv.ventas = 0;
            inv.invTeorico = inv.invFinal;
            inv.invFinal = 0;
            inv.diferencia = null;

            this.datosInventarioService.putDatosInventarioNuevo(inv).subscribe((res) => {
              this.getAllInv();
            });
          }
        }
        });
          this.openSnackBar('Se Actualizo Todo Correctamente', 'End');
        } else {
          this.openSnackBar('Misión Abortada', 'End');
        }
      });
  }



  nada(form: NgForm) {
    let sum = 0, uno = 0, dos = 0, tres = 0;

    form.value.invTeorico = 0;
    form.value.diferencia = 0;
    uno = form.value.invInicial;
    dos = form.value.compras;
    tres = form.value.ventas;
    sum = uno++ + dos-- - tres; //No se le borre los signos pls
    form.value.invTeorico = sum;
    form.value.diferencia = form.value.invFinal - form.value.invTeorico;
    form.value.diferencia = form.value.diferencia.toFixed(3);
  }

  onSubmit(form: NgForm) {
    if (form.value._id == '') {
      form.value.idCliente = this.idCliente;
      form.value.presentacion = this.mililitros;
      form.value.codBebida = this.cod;
      this.datosInventarioService.postDatos(form.value).subscribe((res) => {
        this.openSnackBar('Se Guardo Correctamente', 'End');
      });
    } else {
      if (this.permisoUsuario.changes <= 0) {
        this.openSnackBar('Has agotado tus numero de ediciones', 'End');
        return;
      } else {
        this.datosInventarioService.putDatos(form.value).subscribe((res) => {
          this.openSnackBar('Se Actualizo Correctamente', 'End');
          this.resetFormInv();
          this.getAllInv();
          if (this.permisoUsuario.permisos == true) {
            this.permiso = true;
            form.value.changes = 2;
          } else {
            //console.log(this.permisoUsuario.changes);
            form.value.changes = this.permisoUsuario.changes - 1;
          }
          form.value.fecha = this.dia;
          form.value._id = this.permisoUsuario._id;
          this.users.putDatosChanges(form.value).subscribe((res) => {
            this.Verificar();
          });
        });
      }
    }
    this.editar = !this.editar;
  }

  onEdit(inv: DatosInventario) {
    this.datosInventarioService.selectInventario = inv;
    this.mlText = inv.presentacion;
    this.cod = inv.codBebida;
  }


  onDelete(inv: DatosInventario) {
    this.dialogo
      .open(DialogComponent, {
        data: `¿Estás Seguro que deseas eliminarlo?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          if (this.permisoUsuario.deletes <= 0) {
            this.openSnackBar('Has agotados tu numero de elimaciones', 'End');
            return;
          } else {
            this.datosInventarioService.deleteDato(inv._id).subscribe((res) => {
              this.getAllInv();
            });
            this.openSnackBar('Se Elimino Correctamente', 'End');
          }
          if (this.permisoUsuario.permisos == true) {
            this.permisoUsuario.deletes = 2;
          } else {
            this.permisoUsuario.deletes = this.permisoUsuario.deletes - 1;
          }
          this.users.putDatosDelete(this.permisoUsuario).subscribe((res) => {
            this.Verificar();
          });
        } else {
          this.openSnackBar('Misión Abortada', 'End');
        }
      });
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

  resetSubmit(form?: NgForm) {
    if (form) form.reset();
    this.datosInventarioService.selectInventario = {
      _id: '',
      nombreCli: form.value.nombreCli,
      codBebida: form.value.codBebida,
      categoria: form.value.categoria,
      nombreBebida: form.value.nombreBebida,
      presentacion: form.value.presentacion,
      invInicial: form.value.invFinal,
      compras: 0,
      ventas: 0,
      invTeorico: form.value.invInicial,
      invFinal: 0,
      diferencia: 0,
      idCliente: form.value.idCliente,
      clientes: ''
    };
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
      nombreCli: '',
      codBebida: '',
      categoria: '',
      nombreBebida: '',
      presentacion: '',
      invInicial: null,
      compras: null,
      ventas: null,
      invTeorico: null,
      invFinal: null,
      diferencia: null,
      idCliente: '',
      clientes: ''
    };
  }

  getCategoria(category: string, form: NgForm) {
    this.categoria = category;
  }

  getArticulo(art: string, form: NgForm) {
    this.articulo = art; //Nombre de la bebida

    for (let drink of this.bebidaService.info) {
      if (art == drink.nombre) {
        this.mililitros = drink.ml;
        this.cod = drink.codigo;
        this.mlText = `${drink.ml} ML`;
      }
    }
  }

  getAllInv() {
    let resp = this.datosInventarioService.getDatosList();
    resp.subscribe((res) => (this.dataSource.data = res as DatosInventario[]));
  }

  refrescar(form: NgForm) {
    let resp = this.datosInventarioService.getDatosList();
    resp.subscribe((res) => (this.dataSource.data = res as DatosInventario[]));
    this.nada(form);
  }

}
