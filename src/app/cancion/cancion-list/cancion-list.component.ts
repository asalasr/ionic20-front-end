import { Component, OnInit } from '@angular/core';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cancion-list',
  templateUrl: './cancion-list.component.html',
  styleUrls: ['./cancion-list.component.css']
})
export class CancionListComponent implements OnInit {

  constructor(
    private cancionService: CancionService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  userId: number
  token: string
  canciones: Array<Cancion>
  mostrarCanciones: Array<Cancion>
  mostrarCancionesComp: Array<Cancion>
  cancionSeleccionada: Cancion
  indiceSeleccionado: number = 0

  ngOnInit() {
    if (!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " ") {
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else {
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getCanciones();
    }
  }

  getCanciones(): void {
    this.cancionService.getCancionesUsuario(this.userId, this.token)
      .subscribe(canciones => {

        this.mostrarCanciones = canciones['propios']
        this.mostrarCancionesComp = canciones['compartidas']

        for (let c of canciones['compartidas']) {
          this.mostrarCanciones.push(c)
        }
        this.canciones = this.mostrarCanciones

        this.onSelect(this.mostrarCanciones[0], 0)
      })
  }

  onSelect(cancion: Cancion, indice: number){
    this.indiceSeleccionado = indice
    this.cancionSeleccionada = cancion
    this.cancionService.getAlbumesCancion(cancion.id)
    .subscribe(albumes => {
      this.cancionSeleccionada.albumes = albumes
      this.getComentarios(this.cancionSeleccionada.id)
      this.cancionSeleccionada.esCompartido = this.esCompartida(this.cancionSeleccionada.id)
    },
    error => {
      this.showError(`Ha ocurrido un error: ${error.message}`)
    })
  }

  buscarCancion(busqueda: string) {
    let cancionesBusqueda: Array<Cancion> = []
    this.canciones.map(cancion => {
      if (cancion.titulo.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())) {
        cancionesBusqueda.push(cancion)
      }
    })
    this.mostrarCanciones = cancionesBusqueda
    this.mostrarCancionesComp = cancionesBusqueda
  }

  eliminarCancion() {
    this.cancionService.eliminarCancion(this.cancionSeleccionada.id)
      .subscribe(cancion => {
        this.ngOnInit()
        this.showSuccess()
      },
        error => {
          this.showError("Ha ocurrido un error. " + error.message)
        })
  }

  irCrearCancion() {
    this.routerPath.navigate([`/canciones/create/${this.userId}/${this.token}`])
  }

  showError(error: string) {
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La canción fue eliminada`, "Eliminada exitosamente");
  }

  esCompartida(idCancion: number): boolean {

    for (let c of this.mostrarCancionesComp) {

      if (c.id == idCancion) {
        return true
      }
    }
    return false
  }

  getComentarios(id: number):void{
    this.cancionService.getComments(id, this.token)
    .subscribe( comentarios => {
      this.cancionSeleccionada.comentarios = comentarios['comments']
    },
    error => {
      console.log(error)
    })

  }

}
