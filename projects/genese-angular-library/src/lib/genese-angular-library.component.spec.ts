import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneseAngularLibraryComponent } from './genese-angular-library.component';

describe('GeneseAngularLibraryComponent', () => {
  let component: GeneseAngularLibraryComponent;
  let fixture: ComponentFixture<GeneseAngularLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneseAngularLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneseAngularLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
