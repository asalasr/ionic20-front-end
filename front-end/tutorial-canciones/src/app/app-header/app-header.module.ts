import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { UsuarioModule } from '../usuario/usuario.module';


@NgModule({
  declarations: [ HeaderComponent],
  imports:[CommonModule,UsuarioModule],
  exports: [HeaderComponent]
})
export class AppHeaderModule { }
