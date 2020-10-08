import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DialogComponent } from '../../shared/dialog/dialog.component';

//Services
import { BebidasService } from '../../services/bebidas.service';
import { DatosClientesService } from '../../services/clientes.service';
import { DatosInventarioService } from '../../services/inventario.service';

//Models
import { DatosClientes } from '../../../models/clientes';
import { DatosInventario } from '../../../models/inventario';

//Material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-inventario-inicial',
  templateUrl: './inventario-inicial.component.html',
  styleUrls: ['./inventario-inicial.component.css'],
  providers: [DatosInventarioService, DatosClientesService, BebidasService],
})
export class InventarioInicialComponent implements OnInit {
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

  constructor(
    private router: Router,
    public datosInventarioService: DatosInventarioService,
    public datosClientesService: DatosClientesService,
    public bebidaService: BebidasService,
    private _snackBar: MatSnackBar,
    private dialogo: MatDialog
  ) {}

  ngOnInit() {
    this.resetFormInv();
    this.resetFormCliente();
    this.refrescarListaInventario();
    this.refrescarListaClientes();
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  onSubmit(form: NgForm) {
    this.dialogo
      .open(DialogComponent, {
        data: `El inventario del cliente que estas guardando es: ${form.value.nombre} Estas seguro que deseas guardarlo?`,
      })
      .afterClosed().subscribe((confirmado: Boolean) => {
        if (confirmado) {
          form.value.idCliente = this.idCliente;
          form.value.presentacion = this.mililitros;
          form.value.nombreCli = form.value.nombre;
          form.value.codBebida = this.cod;
          form.value.ventas = 0;
          form.value.compras = 0;
          form.value.invTeorico = form.value.invInicial;
          this.datosInventarioService.postDatos(form.value).subscribe((res) => {
            this.openSnackBar('Se Guardo Correctamente', 'End');
            this.resetFormInv();
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

  clientSearch(name: string, form) {
    for (let inv of this.datosClientesService.DatosClientes) {
      if (inv.nombre == name) {
        form.value.idCliente = inv._id;
        this.idCliente = inv._id;
      }
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
    this.mlText = '';
    this.cod = null;
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
} //Aqui cierra TODO
