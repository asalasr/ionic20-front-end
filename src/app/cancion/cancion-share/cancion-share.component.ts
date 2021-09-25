import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CancionService } from '../cancion.service';
import { ToastrService } from 'ngx-toastr';
import { Cancion } from '../cancion';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { Usuario } from 'src/app/usuario/usuario';

@Component({
  selector: 'app-cancion-share',
  templateUrl: './cancion-share.component.html',
  styleUrls: ['./cancion-share.component.css']
})
export class CancionShareComponent implements OnInit {
  cancionForm !: FormGroup;
  error: boolean = false;
  cancionId: number;
  token: string;
  cancion: Cancion;
  userId: number;
  usuario : Usuario;

  constructor(private cancionService: CancionService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute, private routerPath: Router,
    private toastr: ToastrService,
    private usuarioService:UsuarioService) { }

  ngOnInit() {
    this.cancionForm = new FormGroup({
      usuarios: new FormControl()
   });
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.cancionId = this.router.snapshot.params.cancionId
      this.cancionService.getCancion(this.router.snapshot.params.cancionId)
      .subscribe(cancion => {
        this.cancion = cancion
        this.cancionForm = this.formBuilder.group({
          usuarios: ["", [Validators.required]]
        })
      })

    }
  }

  compartirCancion(){
    this.error = false
    var nombres = this.cancionForm.get('usuarios')?.value.split(";")
    var userName: string

    this.usuarioService.getUser(this.userId,this.token)
    .subscribe(res => {
      this.usuario = res
      userName = this.usuario.nombre

      for (let c of nombres) {
        if (c== userName){
          console.log("mismo usuario")
          this.showError("No se puede compartir la canción a usted mismo")
        }else{
          this.cancionService.compatirCancion(this.cancionId, nombres, this.token)
          .subscribe(cancion => {
            this.showSuccess(this.cancion.titulo, this.cancionForm.get('usuarios')?.value)
            this.cancionForm.reset()
            this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
          },
          error=> {
            if(error.statusText === "UNPROCESSABLE ENTITY"){
              this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")

            }else if(error.statusText === "NOT FOUND"){
              this.showError("No se pudo compartir la canción. Uno de los usuarios no existe")

            }
            else{
              this.showError("Ha ocurrido un error. " + error.message)
            }
          })
        }
      }
    },
    error => {
      console.log(error)
      if(error.statusText === "UNAUTHORIZED"){
        this.showError("Su sesión ha caducado, por favor vuelva a iniciar sesión.")
      }
      else if(error.statusText === "UNPROCESSABLE ENTITY"){
        this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
      }
      else{
        this.showError("Ha ocurrido un error. " + error.message)
      }
    })
  }

  showSuccess(tituloCancion: string, usuarios: string) {
    this.toastr.success(`Se comparitó la canción  ${tituloCancion} con los usuarios ${usuarios}`, "Compartir exitoso");
  }

  showError(error: string){
    this.toastr.error(error, "Error")
  }

  cancelarCompatir(){
    this.cancionForm.reset()
    this.routerPath.navigate([`/canciones/${this.userId}/${this.token}`])
  }
}
