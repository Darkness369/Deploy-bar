import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogo: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: string) { }

  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {
    this.dialogo.close(true);
  }

  ngOnInit(): void {

  }

  /* mostrarDialogo(): void {
    this.dialogo.open(DialogComponent, {
        data: `¿Estás Seguro que deseas eliminarlo?`
      })
      .afterClosed().subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.openSnackBar('Se Actualizo Todo Correctamente','End');
        } else {
          this.openSnackBar('Misión Abortada','End');
        }
      });
  } */

}
