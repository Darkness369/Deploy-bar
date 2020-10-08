import { NgForm } from '@angular/forms';
import { DialogComponent } from '../../shared/dialog/dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';

//Services
import { BebidasService } from '../../services/bebidas.service';

//Models
import { DatosBebidas } from 'src/models/bebidas';

//Material
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-bebidas',
  templateUrl: './bebidas.component.html',
  styleUrls: ['./bebidas.component.css'],
  providers: [BebidasService],
})
export class BebidasComponent implements OnInit {
  ELEMENT_DATA: DatosBebidas[]=[];
  displayedColumns: string[] = [
    'parent',
    'nombre',
    'ml',
    'codigo',
    'Editar',
    'eliminar',
  ];
  dataSource = new MatTableDataSource<DatosBebidas>(this.ELEMENT_DATA);

  constructor(
    public bebidasService: BebidasService,
    private _snackBar: MatSnackBar,
    private dialogo: MatDialog
  ) {}

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  editar = true;

  ngOnInit() {
    this.resetFormBebidas();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.getAllBeb();
  }

  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, {
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit(form: NgForm) {
    if (form.value._id == '') {
      this.bebidasService.postDatos(form.value).subscribe((res) => {
        this.getAllBeb();
        console.log(this.bebidasService.selectBebida.nombre);
        this.openSnackBar('Se Guardo Correctamente', 'End');
        // window.location.reload();
      });
    } else {
      this.bebidasService.putDatos(form.value).subscribe((res) => {
        this.openSnackBar('Se Actualizo Correctamente', 'End');
      });
    }
  }

  onEdit(beb: DatosBebidas) {
    this.bebidasService.selectBebida = beb;
  }

  onDelete(beb: DatosBebidas) {
    this.dialogo
      .open(DialogComponent, {
        data: `¿Estás Seguro que deseas eliminarlo?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.bebidasService.deleteDato(beb._id).subscribe((res) => {
            this.getAllBeb();
            // this.resetForm(form);
            this.openSnackBar('Eliminado Correctamente', 'End');
          });
        } else {
          this.openSnackBar('Misión Abortada', 'End');
        }
      });
  }
  resetFormBebidas(form?: NgForm) {
    if (form) form.reset();
    this.bebidasService.selectBebida = {
      _id: '',
      nombre: '',
      codigo: '',
      ml: null,
      parent: null,
    };
  }

  getAllBeb() {
    let resp = this.bebidasService.getDatosList();
    resp.subscribe((res) => (this.dataSource.data = res as DatosBebidas[]));
  }
}
