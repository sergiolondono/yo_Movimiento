import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientsPhysioComponent } from './patients-physio.component';

describe('PatientsPhysioComponent', () => {
  let component: PatientsPhysioComponent;
  let fixture: ComponentFixture<PatientsPhysioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientsPhysioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientsPhysioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
