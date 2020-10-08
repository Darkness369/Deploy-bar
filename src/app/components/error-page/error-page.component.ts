import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  /*Cambiar color del fondo*/
  bodyTag: HTMLBodyElement = document.getElementsByTagName('body')[0];
  htmlTag: HTMLElement = document.getElementsByTagName('html')[0];
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    /*Cambiar color del fondo*/
    this.bodyTag.classList.add('error-page');
    this.htmlTag.classList.add('error-page');
  }


}
