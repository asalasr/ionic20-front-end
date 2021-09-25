import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Album } from '../album';
import { AlbumService } from '../album.service';

@Component({
  selector: 'app-album-detail',
  templateUrl: './album-detail.component.html',
  styleUrls: ['./album-detail.component.css']
})
export class AlbumDetailComponent implements OnInit {

  @Input() album: Album;
  @Output() deleteAlbum = new EventEmitter();

  userId: number;
  token: string;

  constructor(
    private routerPath: Router,
    private router: ActivatedRoute,
    private albumService: AlbumService
  ) { }

  mostrarAlbumesComp: Array<Album>

  ngOnInit() {
    this.userId = parseInt(this.router.snapshot.params.userId)
    this.token = this.router.snapshot.params.userToken
  }

  goToEdit(){
    this.routerPath.navigate([`/albumes/edit/${this.album.id}/${this.userId}/${this.token}`])
  }

  goToJoinCancion(){
    this.routerPath.navigate([`/albumes/join/${this.album.id}/${this.userId}/${this.token}`])
  }

  eliminarAlbum(){
    this.deleteAlbum.emit(this.album.id)
  }

  compartirAlbum(){
    this.routerPath.navigate([`/albumes/share/${this.album.id}/${this.userId}/${this.token}`])
  }

  comentarAlbum(){
    this.routerPath.navigate([`/albumes/coment/${this.album.id}/${this.userId}/${this.token}`])
  }

  getAlbumes():void{
    this.albumService.getAlbumes(this.userId, this.token)
    .subscribe(albumes => {
      this.mostrarAlbumesComp = albumes['compartidas']
    })
  }
}
