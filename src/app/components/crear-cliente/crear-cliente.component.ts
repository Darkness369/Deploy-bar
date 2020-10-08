import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Component, Input, OnInit, Inject, ViewChild } from '@angular/core';
import { DialogComponent } from '../../shared/dialog/dialog.component';

//Services
import { RecetasService } from '../../services/recetas.service';
import { DatosClientesService } from '../../services/clientes.service';
import { DatosInventarioService } from '../../services/inventario.service';

// Models
import { DatosRecetas } from '../../../models/recetas';
import { DatosClientes } from '../../../models/clientes';
import { DatosInventario } from '../../../models/inventario';

//Módulos necesarios para generación del PDF
import { PdfService } from '../../services/sub-services/pdf.service';

// Material
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-crear-cliente',
  templateUrl: './crear-cliente.component.html',
  styleUrls: [
    './crear-cliente.component.css',
    './tablas-inventario.component.css',
  ],
  providers: [DatosClientesService, DatosInventarioService, RecetasService],
})
export class CrearClienteComponent implements OnInit {
  sortedData: DatosClientes[];

  editar = true;

  nombreReceta: string;
  ingredientes: any[];

  user = {
    _id: '',
    nombreCli:''
  }

  constructor(
    private router: Router,
    public datosClientesService: DatosClientesService,
    public datosInventarioService: DatosInventarioService,
    public recetasService: RecetasService,
    public pdf: PdfService,
    private _snackBar: MatSnackBar,
    private dialogo: MatDialog
  ) {}

  ngOnInit() {
    this.resetForm();
    this.getAllCliente();
    this.refrescarListaClientes();
    this.refrescarInventarios();
    this.refrescarRecetas();

  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  getAllCliente() {
    let resp = this.datosClientesService.getDatosList();
    resp.subscribe((res) => (this.sortedData = res as DatosClientes[]));
  }

  onEdit(emp: DatosClientes) {
    this.datosClientesService.selectClientes = emp;
  }

  onSubmit(form: NgForm) {
    if (form.value._id == '') {
      console.log(this.datosClientesService.selectClientes._id);
      this.datosClientesService.postDatos(form.value).subscribe((res) => {
        this.getAllCliente();
        this.openSnackBar('Se Guardo Correctamente', 'End');
        this.resetForm();
      });
    } else {
      this.datosClientesService.putDatos(form.value).subscribe((res) => {
        this.openSnackBar('Se Actualizo Correctamente', 'End');
          this.RemplazarOldName(form);
      });
    }
  }

  onDelete(emp: DatosClientes) {
    this.dialogo
      .open(DialogComponent, {
        data: `¿Estás Seguro que deseas eliminarlo?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.datosClientesService.deleteDato(emp._id).subscribe((res) => {
            this.getAllCliente();
          });
          this.openSnackBar('Se Elimino Correctamente', 'End');
        } else {
          this.openSnackBar('Misión Abortada', 'End');
        }
      });
  }

    RemplazarOldName(form){
      for (const nombre of this.datosInventarioService.DatosInventario) {
          if(nombre.clientes == form.value._id){
            this.user._id = nombre._id;
            this.user.nombreCli  = form.value.nombre;
            this.datosInventarioService.putDatosNombre(this.user).subscribe((res) =>{
            })
          }
      }
    }

  refrescarInventarios() {
    this.datosInventarioService.getDatosList().subscribe((res) => {
      this.datosInventarioService.DatosInventario = res as DatosInventario[];
    });
  }
  refrescarRecetas() {
    this.recetasService.getDatosList().subscribe((res) => {
      this.recetasService.DatosReceta = res as DatosRecetas[];
    });
  }
  refrescarListaClientes() {
    this.datosClientesService.getDatosList().subscribe((res) => {
      this.datosClientesService.DatosClientes = res as DatosClientes[];
    });
  }

  resetForm(form?: NgForm) {
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

  sortData(sort: Sort) {
    const data = this.sortedData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nombre':
          return compare(a.nombre, b.nombre, isAsc);
        case 'correo':
          return compare(a.correo, b.correo, isAsc);
        case 'telefono':
          return compare(a.telefono, b.telefono, isAsc);
        case 'rfc':
          return compare(a.rfc, b.rfc, isAsc);
        case 'razonSocial':
          return compare(a.razonSocial, b.razonSocial, isAsc);
        case 'direccion':
          return compare(a.direccion, b.direccion, isAsc);
        case 'colonia':
          return compare(a.colonia, b.colonia, isAsc);
        case 'estado':
          return compare(a.estado, b.estado, isAsc);
        case 'cp':
          return compare(a.cp, b.cp, isAsc);
        default:
          return 0;
      }
    });
  }
} //CIERRA CLASS ClienteComponent

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
