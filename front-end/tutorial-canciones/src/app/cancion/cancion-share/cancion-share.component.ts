import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CancionService } from '../cancion.service';
import { ToastrService } from 'ngx-toastr';
import { Cancion } from '../cancion';

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

  constructor(private cancionService: CancionService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute, private routerPath: Router,
    private toastr: ToastrService) { }

  ngOnInit() {
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
