import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album} from './album';
import { Cancion } from '../cancion/cancion';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  private backUrl: string = environment.baseUrl

  constructor(private http: HttpClient) { }

  getAlbumes(usuario: number, token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<any>(`${this.backUrl}/usuario/${usuario}/albumes`, {headers: headers})
  }

  getCancionesAlbum(idAlbum: number, token: string): Observable<Cancion[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Cancion[]>(`${this.backUrl}/album/${idAlbum}/canciones`, {headers: headers})
  }

  crearAlbum(idUsuario: number, token: string, album: Album):Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Album>(`${this.backUrl}/usuario/${idUsuario}/albumes`, album, {headers: headers})
  }

  getAlbum(albumId: number): Observable<Album>{
    return this.http.get<Album>(`${this.backUrl}/album/${albumId}`)
  }

  editarAlbum(idUsuario: number, token: string, albumId: number, album: Album): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.put<Album>(`${this.backUrl}/album/${albumId}`, album, {headers: headers})
  }

  eliminarAlbum(idUsuario: number, token: string, albumId: number): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.delete<Album>(`${this.backUrl}/album/${albumId}`, {headers: headers})
  }

  asociarCancion(albumId: number, cancionId: number): Observable<Cancion>{
    return this.http.post<Cancion>(`${this.backUrl}/album/${albumId}/canciones`, {"id_cancion": cancionId})
  }


  compatirAlbum(albumId: number, usuarios: [string], token: string): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Album>(`${this.backUrl}/album/compartir`, {"id_album": albumId, "lista_usuarios": usuarios}, {headers: headers})
  }

  validarUsuarios(usuarios: [string], token: string): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Album>(`${this.backUrl}/usuarios/lista`, {"lista": usuarios})
  }

  comentarAlbum(albumId: number, comentario: string, token: string): Observable<Album>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Album>(`${this.backUrl}/album/comentarios`, {"id_album": albumId, "message": comentario}, {headers: headers})
  }

  getComments(albumId: number, token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<any>(`${this.backUrl}/album/${albumId}/comentarios`, {headers: headers})
  }

}
