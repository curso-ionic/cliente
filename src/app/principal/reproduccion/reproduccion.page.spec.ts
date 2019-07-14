import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReproduccionPage } from './reproduccion.page';

describe('ReproduccionPage', () => {
  let component: ReproduccionPage;
  let fixture: ComponentFixture<ReproduccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReproduccionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReproduccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
