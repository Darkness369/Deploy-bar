import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PermisosService } from '../../services/permisos.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  permiso:boolean;
  usuarios:any = [];
  usuariosParche:any = [];

  permisoUsuario = {
    email:null,
    permisos:null
}


  constructor(private router: Router,
              private authService: AuthService,
              private users:PermisosService
              ){}

   ngOnInit(): void {
    this.permisoUsuario.email = this.authService.getUserLoggedIn();
    this.Verificar();
  }

   
   Verificar(){
    this.usuarios = this.users.getUsuarios().subscribe(usuarios => { 
      this.usuariosParche = usuarios;
      for(let usuario of this.usuariosParche){
        if(usuario.email == this.permisoUsuario.email){
          this.permiso = usuario.permisos;
        }      
      }
    })
  }
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

}
