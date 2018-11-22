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
}

interface MusicBrainzTrack {
  title: string;
  artists: string[];
  releases: MusicBrainzRelease[];
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
    bootstrap: [ AppComponent ]
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

  constructor(private http:HttpClient, private route: ActivatedRoute) { 
  }

  ngOnInit() {
	this.showSpotify=true;
	this.sub = this.route.params.subscribe(params => {
       this.id = params['id'];
    });
  this.predictedTracks=[];
  this.title = "";
  this.musicBrainzSpotifyTrack = {spotify: {id: "", name: "", artists: [{id: "", name: ""}], album: {id: "", name: "", images: []}}, 
                                  musicbrainz: {title: "", artists: [], releases: [{title: "", artists: []}]}};
  this.artist = {spotify: {id: "", name: "", images: [], genre: []}, musicbrainz: {name: "", disambiguation: "", tags: []}};
  this.album = {spotify: {id: "", name: "", images: [], artists: [], tracks: []}, musicbrainz: {title: "", artists: []}};
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
 ////work :  "http://localhost:5000/home/work/ +id(songid) --> visszatérés: spotifytracklist
}