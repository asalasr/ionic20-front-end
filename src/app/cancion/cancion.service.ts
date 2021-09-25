import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cancion } from './cancion';
import { Album } from '../album/album';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CancionService {

  private backUrl: string = environment.baseUrl

  constructor(private http: HttpClient) { }

  getCancionesAlbum(idAlbum: number, token: string): Observable<Cancion[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<Cancion[]>(`${this.backUrl}/album/${idAlbum}/canciones`, {headers: headers})
  }

  /*getCanciones(): Observable<Cancion[]>{
    return this.http.get<Cancion[]>(`${this.backUrl}/canciones`)
  }*/

  getCancionesUsuario(usuario: number,token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<any>(`${this.backUrl}/usuario/${usuario}/canciones`, {headers: headers})
  }

  getAlbumesCancion(cancionId: number): Observable<Album[]>{
    return this.http.get<Album[]>(`${this.backUrl}/cancion/${cancionId}/albumes`)
  }

  crearCancion(idUsuario: number, token: string, cancion: Cancion):Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Cancion>(`${this.backUrl}/usuario/${idUsuario}/canciones`, cancion, {headers: headers})
  }

  getCancion(cancionId: number): Observable<Cancion>{
    return this.http.get<Cancion>(`${this.backUrl}/cancion/${cancionId}`)
  }

  editarCancion(cancion: Cancion, cancionId: number):Observable<Cancion>{
    return this.http.put<Cancion>(`${this.backUrl}/cancion/${cancionId}`, cancion)
  }

  eliminarCancion(cancionId: number): Observable<Cancion>{
    return this.http.delete<Cancion>(`${this.backUrl}/cancion/${cancionId}`)
  }

  getCompartirCancion(userId: number): Observable<Cancion>{
    return this.http.get<Cancion>(`${this.backUrl}/cancion/compartir/${userId}`)
  }

  compatirCancion(cancionId: number, usuarios: [string], token: string): Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Cancion>(`${this.backUrl}/cancion/compartir`, {"id_cancion": cancionId, "lista_usuarios": usuarios}, {headers: headers})
  }

  comentarCancion(cancionId: number, comentario: string, token: string): Observable<Cancion>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.post<Cancion>(`${this.backUrl}/cancion/comentarios`, {"id_cancion": cancionId, "message": comentario}, {headers: headers})
  }

  getComments(cancionId: number, token: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    })
    return this.http.get<any>(`${this.backUrl}/cancion/${cancionId}/comentarios`, {headers: headers})
  }

}
