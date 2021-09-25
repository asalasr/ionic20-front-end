import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { UsuarioModule } from '../usuario/usuario.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [ HeaderComponent],
  imports:[CommonModule,UsuarioModule, FontAwesomeModule],
  exports: [HeaderComponent]
})
export class AppHeaderModule { }
