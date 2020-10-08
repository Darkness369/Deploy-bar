import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

//Models
import { DatosRecetas } from '../../../models/recetas';
import { DatosClientes } from '../../../models/clientes';
import { DatosInventario } from '../../../models/inventario';

//Services
import { DatosClientesService } from '../../services/clientes.service';
import { DatosInventarioService } from '../../services/inventario.service';
import { RecetasService } from '../../services/recetas.service';

//Módulos necesarios para generación del PDF
import jsPDF from 'jspdf';
import "jspdf-autotable";

//Creación de constante de la función del pdf
let doc: any = new jsPDF();

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  nombreBebida: string;
  presentacion: string;
  invInicial: number;
  compras: number;
  ventas: number;
  invTeorico: number;
  invFinal: number;
  diferencia: number;
  pepe: string;
  day: any;
  month: any;
  year: any;
  hours: any;
  minutes: any;
  editar = true;
  fecha: any;

  arreglodecodigo: any = [];

  pipe = new DatePipe('en-US'); // Use your own locale
  today = Date.now();
  hour = this.pipe.transform(this.today, 'shortTime');

  constructor(public datosClientesService: DatosClientesService,
    public datosInventarioService: DatosInventarioService,
    public recetasService: RecetasService
  ) {

    this.day = new Date().getDate();
    this.month = new Date().getMonth() + 1;
    this.year = new Date().getFullYear();
    this.hours = new Date().getHours();
    this.fecha = `${this.day}/${this.month}/${this.year} ${this.hour}`;

    this.refrescarListaClientes();
    this.refrescarInventarios();
    this.refrescarRecetas();
  }

  GenerarPDF(i) {

    let nameCliente = this.datosClientesService.DatosClientes[i].nombre
    
    doc.autoTable({
      styles: {
        fontStyle: 'normal',
        fontSize: 10,
        cellWidth: 'auto',
        cellPadding: 1,
      },
      columnStyles: { halign: 'center' },
      headStyles: { fontSize: 11, halign: 'center', fillColor: 0 },
      margin: { right: 130 },
      pageBreak: 'avoid',
      body: [
        { uno: this.datosClientesService.DatosClientes[i].nombre },
        { uno: 'Direccion: ' + this.datosClientesService.DatosClientes[i].direccion },
        { uno: 'Colonia: ' + this.datosClientesService.DatosClientes[i].colonia },
        { uno: 'Estado: ' + this.datosClientesService.DatosClientes[i].estado + ' , ' + ' CP: ' + this.datosClientesService.DatosClientes[i].cp, },
        { uno: 'RFC: ' + this.datosClientesService.DatosClientes[i].rfc },
        { uno: 'Correo: ' + this.datosClientesService.DatosClientes[i].correo },
        { uno: 'Telefono: ' + this.datosClientesService.DatosClientes[i].telefono },
      ],
      columns: [
        {
          header: 'Cliente',
          dataKey: 'uno',
        },
      ],
    });
    doc.autoTable({
      headStyles: { fontSize: 11, fillColor: [56, 82, 46] },
      margin: { left: 145, rigt: 15 },
      columnStyles: { code: { halign: 'center' } },
      body: [
        {
          dia: this.fecha
        },

      ],
      columns: [
        { header: 'Fecha', dataKey: 'dia' },
      ],
    });

    for (let inv of this.datosInventarioService.DatosInventario) {
      if (nameCliente == inv.nombreCli.toString()) {
        
        this.nombreBebida = inv.nombreBebida;
        this.presentacion = inv.presentacion;
        this.invInicial = inv.invInicial;
        this.compras = inv.compras;
        this.ventas = inv.ventas;
        this.invTeorico = inv.invTeorico;
        this.invFinal = inv.invFinal;
        this.diferencia = inv.diferencia;
        this.arreglodecodigo.push([
          this.nombreBebida,
          this.presentacion,
          this.invInicial,
          this.compras,
          this.ventas,
          this.invTeorico,
          this.invFinal,
          this.diferencia
        ]);
      }
    }

    doc.text('Inventario', 90, 90, 0)
    doc.autoTable({
      theme: ["striped"],
      styles: { fontStyle: "normal", fontSize: 10, cellWidth: "auto" },
      columnStyles: {
        halign: 'center',
        /* dif: { textColor: [22,207,0], fontStyle: 'normal' }, */
      },
      headStyles: { fontSize: 11, fillColor: 0 },
      margin: { right: 15 },
      pageBreak: "avoid",
      body: this.arreglodecodigo,
      columns: [
        { header: "Articulo", dataKey: "beb" },
        { header: "Pres.", dataKey: "pre" },
        { header: "Inv.Inicial", dataKey: "ini" },
        { header: "Compras", dataKey: "comp" },
        { header: "Ventas", dataKey: "ven" },
        { header: "Inv.Teorico", dataKey: "teo" },
        { header: "Inv.Final", dataKey: "fin" },
        { header: "Diferencia", dataKey: "dif" },
      ],
    });

    //doc.setDrawColor(255,0,0); Esto es para el color de línea del margen
    doc.setLineWidth(1);
    doc.rect(8, 10, 193, 278); // Margen Izq., Margen Superior, Ancho de hoja, Alto de hoja

    doc.addImage("/assets/img/icon.png", 'JPEG', 150, 11, 50, 50); //Margen Izq., Margen Superior, Largo de imagen, Ancho de imagen

    doc.output('dataurlnewwindow'); //abre  una previsualización del pdf en el navegador sin descargar
    doc.save(
      'Inventario-' +
      nameCliente +
      '.pdf'
    );
    doc = new jsPDF();
  }

  refrescarInventarios() {
    this.datosInventarioService.getDatosList().subscribe((res) => {
      this.datosInventarioService.DatosInventario = res as DatosInventario[]
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


}
