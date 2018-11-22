import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogPlaylistComponent } from './dialog-playlist.component';

describe('DialogPlaylistComponent', () => {
  let component: DialogPlaylistComponent;
  let fixture: ComponentFixture<DialogPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
