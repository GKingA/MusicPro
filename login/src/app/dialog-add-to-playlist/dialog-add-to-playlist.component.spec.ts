import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddToPlaylistComponent } from './dialog-add-to-playlist.component';

describe('DialogAddToPlaylistComponent', () => {
  let component: DialogAddToPlaylistComponent;
  let fixture: ComponentFixture<DialogAddToPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogAddToPlaylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddToPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
