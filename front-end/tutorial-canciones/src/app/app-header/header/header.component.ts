import { Component, OnInit ,Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { Usuario } from 'src/app/usuario/usuario';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  usuario : Usuario;
  userLogin: String ;

  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService,
    private usuarioService: UsuarioService,
    ) { }

  ngOnInit(): void {
    this.buscarNombreUsuario();
   }

  goTo(menu: string){
    const userId = parseInt(this.router.snapshot.params.userId)

    const token = this.router.snapshot.params.userToken
    if(menu === "logIn"){
      this.routerPath.navigate([`/`])
    }
    else if(menu === "album"){
      this.routerPath.navigate([`/albumes/${userId}/${token}`])
    }
    else{
      this.routerPath.navigate([`/canciones/${userId}/${token}`])
    }
  }

  buscarNombreUsuario(){
    const userId = parseInt(this.router.snapshot.params.userId)
    const token = this.router.snapshot.params.userToken
    console.log("usuario.userId="+this.router.snapshot.params.userId);

    this.usuarioService.getUser(userId,token)
    .subscribe(usuario => {
      this.usuario = usuario;

      this.userLogin = this.usuario.nombre;
    },
    error => {
      console.log(error)
      if(error.statusText === "UNAUTHORIZED"){
        this.showWarning("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showWarning(warning: string){
    this.toastr.warning(warning, "Error de autenticación")
  }

}
