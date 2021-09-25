import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlbumComentsComponent } from './album-coments.component';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

fdescribe('AlbumComentsComponent', () => {
  let component: AlbumComentsComponent;
  let fixture: ComponentFixture<AlbumComentsComponent>;
  let debug: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbumComentsComponent ],
      imports: [HttpClientModule,  FormsModule, ReactiveFormsModule,
        RouterTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumComentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debug = fixture.debugElement;
  });

  it('should create album comment', () => {
    expect(component).toBeTruthy();
  });

  it('Album - should render title in a h5 tag', async(() => {
    const fixture = TestBed.createComponent(AlbumComentsComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h5').textContent).toContain('Comentarios');
  }));

  it(`Album - form should be invalid`, async(() => {
    component.formComent.controls['coment'].setValue('');
    expect(component.formComent.controls.coment.value != '').toBeFalse();
  }));

  it(`Album - form should be valid`, async(() => {
    component.formComent.controls['coment'].setValue('78768878');
    expect(component.formComent.controls.coment.value != '').toBeTrue();
  }));
});
