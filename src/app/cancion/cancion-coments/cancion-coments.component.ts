import { Component,EventEmitter, OnInit ,Input,Output} from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CancionService } from '../cancion.service';
import { Cancion } from '../cancion';

@Component({
  selector: 'app-cancion-coments',
  templateUrl: './cancion-coments.component.html',
  styleUrls: ['./cancion-coments.component.css']
})
export class CancionComentsComponent implements OnInit {

  @Input() cancion: Cancion;
  @Output() userComment = new EventEmitter();

  public faEdit: any = faEdit;
  public faTrashAlt: any = faTrashAlt;
  public formComent: FormGroup;
  //cancionId: number;
  token: string;

  constructor(private cancionService: CancionService, private router: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) {
    this.formComent = new FormGroup({
      coment: new FormControl('', [Validators.maxLength(1000), Validators.minLength(5)])
    });
  }

  ngOnInit(): void {
    console.log("la cancionid selecionada:" + this.cancion)
    console.log(this.cancion)
    this.formComent = new FormGroup({
      coment : new FormControl('', [Validators.maxLength(1000), Validators.minLength(5)])
    });
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.token = this.router.snapshot.params.userToken
      //this.cancionId = this.router.snapshot.params.cancionId

      /*this.albumService.getAlbum(this.albumId)
      .subscribe(album => {
        this.album = album
        this.formComent = this.formBuilder.group({
        })
      })*/
    }
  }
  viewSectionComentario(){
    this.userComment.emit(this.cancion.id)
  }

  public getComentarios(id: number):void{
    this.cancionService.getComments(id, this.token)
    .subscribe( comentarios => {
      this.cancion.comentarios = comentarios['comments']
    },
    error => {
      console.log(error)
    })

  }

  public deleteComent(): void {
    swal.fire({
      title: '¿Estas seguro de eliminar este comentario?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!'
    }).then((result) => {
      if(result.isConfirmed) {
        this.ngOnInit();
        let toast = swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', swal.stopTimer)
            toast.addEventListener('mouseleave', swal.resumeTimer)
          }
        });
        toast.fire({
          icon: 'success',
          title: 'Comentario eliminado!'
        });
      }
    });
  }

  public saveComent(): void {
    swal.fire({
      title: '¿Estas seguro de publicar este comentario?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No!'
    }).then((result) => {
      if (result.isConfirmed) {
        var comentario = this.formComent.get('coment')?.value
        this.cancionService.comentarCancion(this.cancion.id, comentario, this.token)
        .subscribe(album => {
          this.showSuccess()
          this.formComent.reset()
          this.getComentarios(this.cancion.id);
        })
      }
    });
  }
  showSuccess() {
    this.toastr.success("Comentario publicado!");
  }

  showError(error: string){
    this.toastr.error(error, "Error")
  }
}
