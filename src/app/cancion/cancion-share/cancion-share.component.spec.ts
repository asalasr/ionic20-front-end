/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CancionShareComponent } from './cancion-share.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

fdescribe('CancionShareComponent', () => {
  let component: CancionShareComponent;
  let fixture: ComponentFixture<CancionShareComponent>;
  let debug: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancionShareComponent ],
      imports: [HttpClientModule,  FormsModule, ReactiveFormsModule,
        RouterTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancionShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    debug = fixture.debugElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("Should have a div tag", () => {
    const tag = debug.query(By.css("div")).nativeElement.children;
    expect(tag.length).toBe(1);
  })
});
