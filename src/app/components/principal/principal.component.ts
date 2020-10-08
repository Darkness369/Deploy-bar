import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  /*Cambiar color del fondo*/
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];

  constructor(private router: Router) {}

  ngOnInit(): void {
    /*Cambiar color del fondo*/
    this.bodyTag.classList.add('principal-page');
    this.htmlTag.classList.add('principal-page');
  }

  ngOnDestroy() {
    /*Cambiar color del fondo*/
    this.bodyTag.classList.remove('principal-page');
    this.htmlTag.classList.remove('principal-page');
  }
}
