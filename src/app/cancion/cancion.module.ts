import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CancionListComponent } from './cancion-list/cancion-list.component';
import { AppHeaderModule } from '../app-header/app-header.module';
import { CancionDetailComponent } from './cancion-detail/cancion-detail.component';
import { CancionCreateComponent } from './cancion-create/cancion-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CancionEditComponent } from './cancion-edit/cancion-edit.component';
import { AppFooterModule} from "../app-footer/app-footer.module";
import { CancionShareComponent } from './cancion-share/cancion-share.component';
import { CancionComentsComponent } from './cancion-coments/cancion-coments.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [CancionListComponent, CancionDetailComponent, CancionCreateComponent, CancionEditComponent, CancionShareComponent, CancionComentsComponent],
  imports: [
    CommonModule, AppHeaderModule, ReactiveFormsModule, AppFooterModule, FontAwesomeModule
  ],
  exports:[CancionListComponent, CancionDetailComponent, CancionCreateComponent, CancionEditComponent, CancionShareComponent]
})
export class CancionModule { }
