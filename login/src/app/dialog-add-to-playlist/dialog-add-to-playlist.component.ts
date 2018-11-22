import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSelectModule} from '@angular/material';

export interface Playlist {
  id: string;
  name:string;
}

@Component({
  selector: 'app-dialog-add-to-playlist',
  templateUrl: './dialog-add-to-playlist.component.html',
  styleUrls: ['./dialog-add-to-playlist.component.css']
})
export class DialogAddToPlaylistComponent implements OnInit {

  constructor(dialogRef: MatDialogRef<DialogAddToPlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Playlist) {}

  ngOnInit() {
  }
}
