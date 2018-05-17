import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserapplicationComponent } from './userapplication.component';

describe('UserapplicationComponent', () => {
  let component: UserapplicationComponent;
  let fixture: ComponentFixture<UserapplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserapplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserapplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
