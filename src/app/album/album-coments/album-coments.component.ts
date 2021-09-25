import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import swal from 'sweetalert2';
import { AlbumService } from '../album.service';
import { ToastrService } from 'ngx-toastr';
import { Album } from '../album';

@Component({
  selector: 'app-album-coments',
  templateUrl: './album-coments.component.html',
  styleUrls: ['./album-coments.component.css']
})
export class AlbumComentsComponent implements OnInit {

  @Input() album: Album;
  @Output() userComment = new EventEmitter();

  public faEdit: any = faEdit;
  public faTrashAlt: any = faTrashAlt;
  public formComent: FormGroup;
  //albumId: number;
  token: string;

  constructor(private albumService: AlbumService, private router: ActivatedRoute,
    private toastr: ToastrService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formComent = new FormGroup({
      coment : new FormControl('', [Validators.maxLength(1000), Validators.minLength(5)])
    });
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.token = this.router.snapshot.params.userToken
     // this.albumId = this.router.snapshot.params.albumId
    }
  }

  public getComments() {
    this.albumService.getComments(this.album.id, this.token).subscribe(
      response => {
        this.album.comentarios = response['comments'];
      },
      error => {
        swal.fire("¡Error!", error, "error");
      }
    );
  }

  viewSectionComentario(){
    this.userComment.emit(this.album.id)

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
        this.albumService.comentarAlbum(this.album.id, comentario, this.token)
        .subscribe(album => {
          this.showSuccess()
          this.formComent.reset()
          this.getComments();
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
