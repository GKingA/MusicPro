import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  playlistName: string;
}

@Component({
  selector: 'app-dialog-playlist',
  templateUrl: './dialog-playlist.component.html',
  styleUrls: ['./dialog-playlist.component.css']
})
export class DialogPlaylistComponent implements OnInit {

  constructor(dialogRef: MatDialogRef<DialogPlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
  }

}
