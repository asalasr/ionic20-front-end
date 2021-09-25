import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Album } from '../album';
import { AlbumService } from '../album.service';
import { UsuarioService } from 'src/app/usuario/usuario.service';
import { Usuario } from 'src/app/usuario/usuario';

@Component({
  selector: 'app-album-share',
  templateUrl: './album-share.component.html',
  styleUrls: ['./album-share.component.css']
})
export class AlbumShareComponent implements OnInit {

  userId: number;
  token: string;
  albumId: number;
  album: Album;
  albumForm !: FormGroup;
  usuario : Usuario;

  error: boolean = false

  constructor(private albumService: AlbumService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute, private routerPath: Router,
    private toastr: ToastrService,
    private usuarioService:UsuarioService) { }

  ngOnInit() {
    this.albumForm = new FormGroup({
      usuarios: new FormControl()
   });
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.albumId = this.router.snapshot.params.albumId
      this.albumService.getAlbum(this.albumId)
      .subscribe(album => {
        this.album = album
        this.albumForm = this.formBuilder.group({
          usuarios: [album.usuario, [Validators.required]]
        })
      })

    }
  }

  compartirAlbum(){

    this.error = false
    var nombres = this.albumForm.get('usuarios')?.value.split(";")
    var userName: string

    this.usuarioService.getUser(this.userId,this.token)
    .subscribe(res => {
      this.usuario = res
      userName = this.usuario.nombre

      for (let c of nombres) {
        if (c== userName){
          console.log("mismo usuario")
          this.showError("No se puede compartir al album a usted mismo")
        }else{
          this.albumService.compatirAlbum(this.albumId, nombres, this.token)
          .subscribe(album => {
            this.showSuccess(this.album.titulo, this.albumForm.get('usuarios')?.value)
            this.albumForm.reset()
            this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
          },
          error=> {
            if(error.statusText === "UNPROCESSABLE ENTITY"){
              this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")

            }else if(error.statusText === "NOT FOUND"){
              this.showError("No se pudo compartir el álbum. Uno de los usuarios no existe")

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

  cancelarCompatir(){
    this.albumForm.reset()
    this.routerPath.navigate([`/albumes/${this.userId}/${this.token}`])
  }

  showError(error: string){
    this.toastr.error(error, "Error")
  }

  showSuccess(tituloAlbum: string, usuarios: string) {
    this.toastr.success(`Se comparitó el álbum  ${tituloAlbum} con los usuarios ${usuarios}`, "Compartir exitoso");
  }

}
