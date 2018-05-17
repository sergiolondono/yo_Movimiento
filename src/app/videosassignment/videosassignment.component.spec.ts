import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosassignmentComponent } from './videosassignment.component';

describe('VideosassignmentComponent', () => {
  let component: VideosassignmentComponent;
  let fixture: ComponentFixture<VideosassignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosassignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
