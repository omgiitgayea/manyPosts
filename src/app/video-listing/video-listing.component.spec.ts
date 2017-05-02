/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VideoListingComponent } from './video-listing.component';

describe('VideoListingComponent', () => {
  let component: VideoListingComponent;
  let fixture: ComponentFixture<VideoListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
