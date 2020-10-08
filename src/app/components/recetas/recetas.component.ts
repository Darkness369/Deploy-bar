import { NgForm } from '@angular/forms';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Component, OnInit } from '@angular/core';

// Services
import { RecetasService } from '../../services/recetas.service';
import { BebidasService } from '../../services/bebidas.service';
import { DatosClientesService } from '../../services/clientes.service';
import { DatosInventarioService } from 'src/app/services/inventario.service';

//Models
import { DatosClientes } from '../../../models/clientes';
import { DatosBebidas } from 'src/models/bebidas';
import { DatosInventario } from '../../../models/inventario';

//Material
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.component.html',
  styleUrls: ['./recetas.component.css'],
  providers: [RecetasService, DatosClientesService, BebidasService],
})
export class RecetasComponent implements OnInit {
  bebidaDatos: DatosBebidas[];
  Ingred = [];
  idCliente: string;
  selectedid: string = '';
  selectedCliente: string = '';
  direccion: string;
  nombreReceta: string;
  Nom: string;
  categoria = '';
  articulo = '';
  mlText = '';
  ml=0;

  mililitros = null;
  cod = null;
  cantOz1=0;
  cantml1=0;
  texto:string='Sin existencias';

  constructor(
    public recetasService: RecetasService,
    public datosClientesService: DatosClientesService,
    public bebidaService: BebidasService,
    private _snackBar: MatSnackBar,
    public datosInventarioService: DatosInventarioService,
    private dialogo: MatDialog
  ) {}

  ngOnInit() {
    this.resetFormCliente();
    this.refrescarListaClientes();
    this.refrescarBebidas();
    this.resetFormReceta();
    this.refrescarInventarios();
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  clientSearch(name: string, form) {
    for (let receta of this.datosClientesService.DatosClientes) {
      if (receta.nombre == name) {
        form.value.idCliente = receta._id;
        this.idCliente = receta._id;
      }
    }
  }

  agregarArticulo(form?: NgForm) {
    this.Nom = form.value.nombreReceta;
    console.log(this.Nom);
    this.Ingred.push([
      form.value.categoria,
      form.value.nombreArt,
      this.mililitros,
      this.cantOz1,
      this.cantml1,
      this.cod,
    ]);
    this.resetFormReceta2();
    this.mlText = '';
    this.cantOz1=0;
    form.value.nombreReceta = this.Nom;
    this.recetasService.selectReceta.nombreReceta = this.Nom;
    this.setRecipeName(this.Nom);
  }
  OZ(canto:number){
    this.cantOz1=Math.round((canto*29.5735/this.ml)*100)/100;
    this.cantml1=Math.round((canto)*100)/100;
  }
  onSubmit(form: NgForm) {
    this.dialogo
      .open(DialogComponent, {
        data: `La receta del cliente que estas guardando es: ${form.value.nombre}. Estas seguro que deseas guardarlo?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          form.value.idCliente = this.idCliente;
          form.value.presentacion = this.mililitros;
          form.value.codBebida = this.cod;
          form.value.ingredientes = this.Ingred;
          form.value.nombreCli = form.value.nombre;
          this.recetasService.postDatos(form.value).subscribe((res) => {
            this.openSnackBar('Se Actualizo Todo Correctamente', 'End');
            this.resetFormReceta();
          });
        } else {
          this.openSnackBar('Misión Abortada', 'End');
        }
      });
  }

  refrescarListaClientes() {
    this.datosClientesService.getDatosList().subscribe((res) => {
      this.datosClientesService.DatosClientes = res as DatosClientes[];
    });
  }
  refrescarBebidas() {
    this.bebidaService.getDatosList().subscribe((res) => {
      this.bebidaService.DatosBebidas = res as DatosBebidas[];
    });
  }
  refrescarInventarios() {
    this.datosInventarioService.getDatosList().subscribe((res) => {
      this.datosInventarioService.DatosInventario = res as DatosInventario[];
    });
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

  resetFormReceta(form?: NgForm) {
    if (form) form.reset();
    this.recetasService.selectReceta = {
      _id: '',
      nombreReceta: '',
      categoria: '',
      nombreArt: '',
      presentacion: null,
      cantNecesaria: null,
      idCliente: '',
      ingredientes: null,
      codigo: '',
      nombreCli: '',
      cantOz:null,
    };
  }

  resetFormReceta2(form?: NgForm) {
    if (form) form.reset();
    this.recetasService.selectReceta = {
      _id: '',
      nombreReceta: '',
      categoria: '',
      nombreArt: '',
      presentacion: null,
      cantNecesaria: null,
      idCliente: '',
      ingredientes: null,
      codigo: '',
      nombreCli: '',
      cantOz:null,
    };
    this.mlText = '';
    this.cod = null;
  }

  getCategoria(category: string, form: NgForm) {
    this.categoria = category;
  }

  getArticulo(art: string, form: NgForm) {
    this.articulo = art; //Nombre de la bebida

    for (let drink of this.datosInventarioService.info) {
      if (art == drink.nombreBebida) {
        this.mililitros = drink.presentacion;
        this.cod = drink.codBebida;
        this.mlText = `${drink.presentacion} ML`;
        this.ml=drink.presentacion;
      }
    }
  }

  setRecipeName(name: string) {
    // Modifica el nombre de la variable  del servicio
    this.nombreReceta = name; //Captura el nombre
  }
} //AQUI CIERRA TODO
