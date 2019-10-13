import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneseAngularComponent } from './genese-angular.component';

describe('GeneseAngularComponent', () => {
  let component: GeneseAngularComponent;
  let fixture: ComponentFixture<GeneseAngularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneseAngularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneseAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
