import { NgForm } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DialogComponent } from '../../shared/dialog/dialog.component';

//Services
import { BebidasService } from '../../services/bebidas.service';
import { RecetasService } from '../../services/recetas.service';
import { DatosClientesService } from '../../services/clientes.service';
import { DatosInventarioService } from 'src/app/services/inventario.service';

//Models
import { DatosBebidas } from 'src/models/bebidas';
import { DatosRecetas } from '../../../models/recetas';
import { DatosClientes } from '../../../models/clientes';
import { DatosInventario } from '../../../models/inventario';

//Material
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-recetas-analisis',
  templateUrl: './recetas-analisis.component.html',
  styleUrls: ['./recetas-analisis.component.css'],
  providers: [RecetasService, DatosClientesService],
})
export class RecetasAnalisisComponent implements OnInit {
  ELEMENT_DATA: DatosRecetas[]=[];
  displayedColumns: string[] = [
    'nombreCli',
    'nombreReceta',
    'Ver',
    'Editar',
    'eliminar',
  ];
  dataSource = new MatTableDataSource<DatosRecetas>(this.ELEMENT_DATA);

  constructor(
    public recetasService: RecetasService,
    public datosClientesService: DatosClientesService,
    public bebidaService: BebidasService,
    private _snackBar: MatSnackBar,
    public datosInventarioService: DatosInventarioService,
    private dialogo: MatDialog
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  editarReceta = true;
  ver = true;
  categoria = '';
  articulo = '';
  nciselec=[];
  mlText = '';
  mililitros = null;
  cod = null;
  Ingred = [];
  Nom: string;
  ni=[];
  idCliente: string;
  selectedid: string = '';
  selectedCliente: string = '';
  direccion: string;
  nombreReceta: string;

  texto:string='Sin existencias';

  ngOnInit() {
    this.refrescarListaRecetas();
    this.resetFormCliente();
    this.refrescarListaClientes();
    this.refrescarBebidas();
    this.resetFormReceta();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  abrirVer(){
    this.editarReceta=true;
    this.ver=false; 
  }
  abrirEditar(){
    this.editarReceta=false;
    this.ver=true 
  }
  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  applyFilter(filterValue: string) {
    this.getAllRecetas();
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  clientSearch(name: string, form) {
    for (let receta of this.datosClientesService.DatosClientes) {
      if (receta.nombre == name) {
        form.value.idCliente = receta._id;
        this.idCliente = receta._id;
      }
    }
  }
agre(O,P){
  this.ni.push([
    
  ]);
}
  onSubmit(form: NgForm) {
   
    if (form.value._id == '') {
      form.value.idCliente = this.idCliente;
      form.value.presentacion = this.mililitros;
      
      this.recetasService.postDatos(form.value).subscribe((res) => {
        this.openSnackBar('Se Guardó Correctamente', 'End');
      });
    } else {
      
      for(let x in this.recetasService.selectReceta.ingredientes){

              console.log((this.recetasService.selectReceta.ingredientes[x][3])+"");
              console.log((this.nciselec[x])+"");
              if(this.nciselec[x]> 0){

              this.recetasService.selectReceta.ingredientes[x][4]=Math.round((this.nciselec[x])*100)/100;
              this.recetasService.selectReceta.ingredientes[x][3]=Math.round((this.nciselec[x]*29.5735/this.recetasService.selectReceta.ingredientes[x][2])*100)/100;
              }
              this.recetasService.putDatos(this.recetasService.selectReceta).subscribe((res) => {
                this.openSnackBar('Se Actualizo Correctamente', 'End');
              });
      }
      
      



      
      this.recetasService.putDatos(form.value).subscribe((res) => {
        this.openSnackBar('Se Actualizo Correctamente', 'End');
      });
    }
  }

  onEdit(rec: DatosRecetas) {
    this.recetasService.selectReceta = rec;
    this.mlText = `${rec.presentacion} ML`;
  }

  onDelete(rec: DatosRecetas) {
    this.dialogo
      .open(DialogComponent, {
        data: `¿Estás Seguro que deseas eliminarlo?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.recetasService.deleteDato(rec._id).subscribe((res) => {
            this.getAllRecetas();
            this.openSnackBar('Eliminado Correctamente', 'End');
          });
        } else {
          this.openSnackBar('Misión Abortada', 'End');
        }
      });
  }

  agregarArticulo(form?: NgForm) {
    this.Nom = form.value.nombreReceta;
    console.log(this.Nom);
    this.Ingred.push([
      form.value.categoria,
      form.value.nombreArt,
      this.mililitros,
      form.value.cantNecesaria,
      this.cod,
    ]);
    this.resetFormReceta2();
    this.mlText = '';
    form.value.nombreReceta = this.Nom;
    this.recetasService.selectReceta.nombreReceta = this.Nom;
    this.setRecipeName(this.Nom);
  }

  refrescarListaRecetas() {
    this.recetasService.getDatosList().subscribe((res) => {
      this.recetasService.DatosReceta = res as DatosRecetas[];
    });
  }

  refrescarListaClientes() {
    this.datosClientesService.getDatosList().subscribe((res) => {
      this.datosClientesService.DatosClientes = res as DatosClientes[];
    });
  }

  refrescarInventarios() {
    this.datosInventarioService.getDatosList().subscribe((res) => {
      this.datosInventarioService.DatosInventario = res as DatosInventario[];
    });
  }

  refrescarBebidas() {
    this.bebidaService.getDatosList().subscribe((res) => {
      this.bebidaService.DatosBebidas = res as DatosBebidas[];
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
      }
    }
  }


  getAllRecetas() {
    let resp = this.recetasService.getDatosList();
    resp.subscribe((res) => (this.dataSource.data = res as DatosRecetas[]));
  }

  setRecipeName(name: string) {
    // Modifica el nombre de la variable  del servicio
    this.nombreReceta = name; //Captura el nombre
  }
} //Aqui cierra
