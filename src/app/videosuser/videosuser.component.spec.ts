import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideosuserComponent } from './videosuser.component';

describe('VideosuserComponent', () => {
  let component: VideosuserComponent;
  let fixture: ComponentFixture<VideosuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideosuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideosuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
