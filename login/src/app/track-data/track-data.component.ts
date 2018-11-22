import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from "rxjs";
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import {AppComponent} from '../app.component';
//import {ServiceModule} from '../service/service.module';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DialogAddToPlaylistComponent } from '../dialog-add-to-playlist/dialog-add-to-playlist.component';
import { DialogPlaylistComponent } from '../dialog-playlist/dialog-playlist.component';

// Helper interfaces

interface SpotifyAlbumTrack {
  id: string;
  name: string;
  artists: SpotifyTrackArtist[];
}

interface SpotifyTrackArtist {
  id: string;
  name: string;
}

interface SpotifyImage {
  width: number;
  height: number;
  url: string;
}

interface SpotifyTrackAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
}

// Real interfaces
// Spotify

interface Playlist {
  id: string;
  name:string;
}

interface SpotifyAlbum {
  id: string;
  name: string;
  date: string;
  images: SpotifyImage[];
  artists: SpotifyTrackArtist[];
  tracks: SpotifyAlbumTrack[];
}

interface SpotifyArtist {
  id: string;
  name: string;
  images: SpotifyImage[];
  genre: string[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyTrackArtist[];
  album: SpotifyTrackAlbum;
}

// MusicBrainz

interface MusicBrainzArtist {
  name: string;
  disambiguation: string;
  tags: string[];
}

interface MusicBrainzRelease {
  title: string;
  artists: string[];
  date: string;
}

interface MusicBrainzTrack {
  title: string;
  artists: string[];
  releases: string[];
}

// MusicBrainz and Spotify

interface MusicBrainzSpotifyTrack {
  spotify: SpotifyTrack;
  musicbrainz: MusicBrainzTrack;
}

interface MusicBrainzSpotifyArtist {
  spotify: SpotifyArtist;
  musicbrainz: MusicBrainzArtist;
}

interface MusicBrainzSpotifyAlbum {
  spotify: SpotifyAlbum;
  musicbrainz: MusicBrainzRelease;
}

@NgModule({
    imports: [ BrowserModule, HttpModule ],
    providers: [],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ],
    entryComponents: [DialogAddToPlaylistComponent]
})

@Component({
  selector: 'app-track-data',
  templateUrl: './track-data.component.html',
  styleUrls: ['./track-data.component.css']
})

export class TrackDataComponent implements OnInit {
	private sub: any;
	id: string;
	title: string;
	playlists: Playlist[];
	playlistTracks: SpotifyTrack[];
	artist: MusicBrainzSpotifyArtist;
	album: MusicBrainzSpotifyAlbum;
	musicBrainzSpotifyTrack: MusicBrainzSpotifyTrack;
	showSpotify: boolean;
	predictedTracks: SpotifyTrack[];
  addDialogRef: MatDialogRef<DialogAddToPlaylistComponent>;
  newDialogRef: MatDialogRef<DialogPlaylistComponent>;
  playlist: Playlist;
  playlistName: string;
  playlistId: string;

  constructor(private http:HttpClient, private route: ActivatedRoute, public addDialog: MatDialog, public newDialog: MatDialog) { 
  }

  ngOnInit() {
	this.showSpotify=true;
	this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];
    });
  this.predictedTracks=[];
  this.title = "";
  this.musicBrainzSpotifyTrack = {spotify: {id: "", name: "", artists: [{id: "", name: ""}], album: {id: "", name: "", images: []}}, 
                                  musicbrainz: {title: "", artists: [], releases: []}};
  this.artist = {spotify: {id: "", name: "", images: [], genre: []}, musicbrainz: {name: "", disambiguation: "", tags: []}};
  this.album = {spotify: {id: "", name: "", images: [], artists: [], tracks: [], date: ""}, musicbrainz: {title: "", artists: [], date: ""}};
  this.http.get<Playlist[]>("http://localhost:5000/home/playlists", {withCredentials:true}).subscribe((data: Playlist[]) => {this.playlists = data;
    this.http.get<MusicBrainzSpotifyTrack>("http://localhost:5000/home/song/" +this.id, {withCredentials:true}).subscribe((data: MusicBrainzSpotifyTrack) => {this.title = data.spotify.name; this.musicBrainzSpotifyTrack = data;
      this.http.get<MusicBrainzSpotifyArtist>("http://localhost:5000/home/artist/" +this.musicBrainzSpotifyTrack.spotify.artists[0].id, {withCredentials:true}).subscribe((data: MusicBrainzSpotifyArtist) => {this.artist = data;
        this.http.get<MusicBrainzSpotifyAlbum>("http://localhost:5000/home/album/" +this.musicBrainzSpotifyTrack.spotify.album.id, {withCredentials:true}).subscribe((data: MusicBrainzSpotifyAlbum) => {this.album = data;});
      });
    });
  });
  this.playlistTracks = [];
  this.predictedTracks = [];
  }

  onSelectPlaylist(id: string) {
    var observer = this.http.get<SpotifyTrack[]>("http://localhost:5000/home/playlists/" + id + "/tracks", {withCredentials:true});
    observer.subscribe((data: SpotifyTrack[]) => {this.playlistTracks = data;});
  }

  onWork(){
    this.http.get<SpotifyTrack[]>("http://localhost:5000/home/work/" + this.id,  {withCredentials:true}).subscribe((data: SpotifyTrack[]) => {this.predictedTracks = data;});
  }

  addToPlaylist(id: string) {
    this.addDialogRef = this.addDialog.open(DialogAddToPlaylistComponent, {
      data: {id: this.playlistId}
    });

    this.addDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.playlistId = result;
      if(this.playlistId != null) {
        this.http.get("http://localhost:5000/home/playlists/"+this.playlistId+"/add/"+id, {withCredentials:true}).subscribe((data: Playlist) => this.playlist = data);
      }
    });
  }
  
  onToggleChange(){
	if(this.showSpotify==true)
	{
		  this.showSpotify=false;
	}
	 else {
		 this.showSpotify=true;
	}
  }

  addPlaylist() {
    this.newDialogRef = this.newDialog.open(DialogPlaylistComponent, {
      data: {playlistName: this.playlistName}
    });

    this.newDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.playlistName = result;
      if(this.playlistName != null) {
        this.http.get("http://localhost:5000/home/playlists/new/"+this.playlistName, {withCredentials:true}).subscribe((data: Playlist[]) => this.playlists = data);
      }
    });
  }

 ////work :  "http://localhost:5000/home/work/ +id(songid) --> visszatérés: spotifytracklist
}