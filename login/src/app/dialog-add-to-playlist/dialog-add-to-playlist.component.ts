import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSelectModule} from '@angular/material';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  playlists: Playlist[];

  constructor(dialogRef: MatDialogRef<DialogAddToPlaylistComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Playlist, private http:HttpClient) {}

  ngOnInit() {
    this.http.get<Playlist[]>("http://localhost:5000/home/playlists", {withCredentials:true}).subscribe((data: Playlist[]) => {this.playlists = data;});
  }
}
