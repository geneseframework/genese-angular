import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneseComponent } from './genese.component';

describe('GeneseAngularComponent', () => {
  let component: GeneseComponent;
  let fixture: ComponentFixture<GeneseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
