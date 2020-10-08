import { Component, OnInit, ViewChild } from '@angular/core';
import * as faker from 'faker';


import { Ventas } from '../../../models/ventas';
import { NgForm } from '@angular/forms';
import { DialogComponent } from '../../shared/dialog/dialog.component';

//Services
import { AuthService } from '../../services/auth.service';
import { ExcelService } from '../../services/sub-services/excel.service';
import { BebidasService } from '../../services/bebidas.service';
import { PermisosService } from '../../services/permisos.service';
import { DatosClientesService } from '../../services/clientes.service';
import { DatosInventarioService } from '../../services/inventario.service';

import { DatosRecetas } from '../../../models/recetas';

import { RecetasService } from '../../services/recetas.service';

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
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-leer-excel',
  templateUrl: './leer-excel.component.html',
  styleUrls: ['./leer-excel.component.css', './tabla.component.css'],
  providers: [DatosInventarioService, DatosClientesService, BebidasService,RecetasService],
})
export class LeerExcelComponent implements OnInit {

  importVentas: Ventas[] = [];
  exportVentas: Ventas[] = [];

  displayedColumns: string[] = [
    'clave',
    'descripcion',
    'cantidad'
  ];
  dataSource = new MatTableDataSource<Ventas>(this.importVentas);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public excelService: ExcelService, public datosInventarioService: DatosInventarioService,
    public datosClientesService: DatosClientesService,
    public bebidaService: BebidasService,
    public users: PermisosService,
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private dialogo: MatDialog,
    public recetasService: RecetasService,) { }

    idCliente: string;
    selectedId: string = '';
    selectedCliente: string = '';

    excel: string = '';
idcl="";
    clientSearch(name: string) {
      for (let inv of this.datosClientesService.DatosClientes) {
        
        if (inv.nombre == name) {
          this.excel = inv.nombre;
          this.idcl = inv._id;
          this.idCliente = inv._id;
          this.selectedId = inv._id;
        }
      }
    }

  ngOnInit(): void {
    
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.excelService.nombre
    this.refrescarListaRecetas();
    this.refrescarListaClientes();
    this.refrescarListaInventario();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    for (let index = 0; index < 10; index++) {
      const venton = new Ventas();
      venton.clave = faker.clave.findClave();
      venton.descripcion = faker.descripcion.findDescripcion();
      venton.cantidad = faker.cantidad.findCantidad();
      this.exportVentas.push(venton);
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  sup(){
    try {
      for(let i=0; i<this.importVentas.length;i++){
        let x=true;
        let y=1;
        for (let inv of this.datosInventarioService.DatosInventario)  {
          if(inv.nombreCli==this.excelService.nombre){
          
          if(inv.nombreBebida.toLowerCase()==this.importVentas[i].descripcion.toString().toLowerCase()){
            if(x){
              console.log(inv.nombreBebida+" "+this.importVentas[i].cantidad );
              console.log("ventas = "+inv.ventas+" + "+this.importVentas[i].cantidad+" = "+(inv.ventas+this.importVentas[i].cantidad));
              
              inv.ventas=Math.round((inv.ventas+this.importVentas[i].cantidad)*100)/100;
              console.log("IT ini= "+inv.invTeorico);
              console.log("inv ventas= "+inv.ventas);
              console.log("imp cant= "+this.importVentas[i].cantidad);
              console.log("inv compras= "+inv.compras);
              inv.invTeorico=Math.round((inv.invTeorico-inv.ventas+inv.compras)*100)/100;
              console.log("IT fin= "+inv.invTeorico);
              this.datosInventarioService.putDatos(inv).subscribe((res) => {
               
              });
              x=false;
            //Aqui va la magia
            }
          }         }
        }
        for (let inv of this.recetasService.DatosReceta) {
          if(inv.nombreReceta.toLowerCase()==this.importVentas[i].descripcion.toString().toLowerCase()){
            console.log(inv.nombreReceta);
            for(let i=0;i<inv.ingredientes.length;i++){
              x=true;
                console.log(inv.ingredientes[i][1]);
                for (let inv2 of this.datosInventarioService.DatosInventario)  {
                  if(inv2.nombreCli==this.excelService.nombre){
                  if(x){
                  if(inv.ingredientes[i][1]==inv2.nombreBebida){
                    console.log("ventas = "+inv2.ventas+" + ("+inv.ingredientes[i][3]+" x "+this.importVentas[i].cantidad+") = "+(inv2.ventas+inv.ingredientes[i][3]*this.importVentas[i].cantidad));
                   inv2.ventas= Math.round((inv2.ventas+inv.ingredientes[i][3]*this.importVentas[i].cantidad)*100)/100;
                   console.log("IT ini= "+inv2.invTeorico);
                   
                   inv2.invTeorico=Math.round((inv2.invTeorico-inv2.ventas+inv2.compras)*100)/100;
                   console.log("IT fin= "+inv2.invTeorico);
                   
                   this.datosInventarioService.putDatos(inv2).subscribe((res) => {
                     
                    });
                    x=false;
                 
                     }
                }}}
  
              
            }
            
          }
  
        }
      }
      this.openSnackBar('Ventas guardadas correctamente', 'End');
    } catch (error) {
      this.openSnackBar('Resultado inesperado', 'End');
      console.log(error);
    }

  } //Aqui cierra sup

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {

      const bstr: string = e.target.result;
      const data = <any[]>this.excelService.importFromFile(bstr);

      const header: string[] = Object.getOwnPropertyNames(new Ventas());
      const importedData = data.slice(1, -1);

      this.importVentas = importedData.map(arr => {
        const obj = {};
        for (let i = 0; i < header.length; i++) {
          const k = header[i];
          obj[k] = arr[i];
        }
        return <Ventas>obj;
      })

      this.dataSource.data = importedData.map(arr => {
        const obj = {};
        for (let i = 0; i < header.length; i++) {
          const k = header[i];
          obj[k] = arr[i];
        }
        return <Ventas>obj;
      })

    };
    reader.readAsBinaryString(target.files[0]);

  }


  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'right',
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


  refrescarListaRecetas() {
    this.recetasService.getDatosList().subscribe((res) => {
      this.recetasService.DatosReceta = res as DatosRecetas[];
    });
  }
} //cierra todo

