import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './usuario';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class UsuarioService {

    private backUrl: string = environment.baseUrl

    constructor(private http: HttpClient) { }

    userLogIn(nombre: string, contrasena: string):Observable<any>{
        return this.http.post<any>(`${this.backUrl}/logIn`, {"nombre": nombre, "contrasena": contrasena });
    }

    userSignUp(nombre: string, contrasena: string): Observable<any>{
        return this.http.post<any>(`${this.backUrl}/signin`, {"nombre": nombre, "contrasena": contrasena});
    }

    getUser(idUser:number, token: string): Observable<Usuario>{
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
      return this.http.get<Usuario>(`${this.backUrl}/user/${idUser}`, {headers: headers})
    }
}
