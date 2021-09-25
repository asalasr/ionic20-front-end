import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cancion } from '../cancion';
import { CancionService } from '../cancion.service';

@Component({
  selector: 'app-cancion-detail',
  templateUrl: './cancion-detail.component.html',
  styleUrls: ['./cancion-detail.component.css']
})
export class CancionDetailComponent implements OnInit {

  @Input() cancion: Cancion;
  @Output() deleteCancion = new EventEmitter();

  userId: number;
  token: string;

  constructor(
    private router: ActivatedRoute,
    private routerPath: Router,
    private cancionService: CancionService,
  ) { }

  mostrarCancionesComp: Array<Cancion>

  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken

  }

  eliminarCancion(){
    this.deleteCancion.emit(this.cancion.id)
  }

  goToEdit(){
    this.routerPath.navigate([`/canciones/edit/${this.cancion.id}/${this.userId}/${this.token}`])
  }

  compartirCancion(){
    this.routerPath.navigate([`/canciones/share/${this.cancion.id}/${this.userId}/${this.token}`])
  }

  getCanciones():void{
    this.cancionService.getCancionesUsuario(this.userId, this.token)
    .subscribe(canciones => {

      this.mostrarCancionesComp = canciones['compartidas']

    })
  }

}
