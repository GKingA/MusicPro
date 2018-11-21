import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import {AppComponent} from '../app.component';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as $ from 'jquery';

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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit {
  playlists: Playlist[];
  playlistTracks: SpotifyTrack[];
  musicBrainzSpotifyTrack: MusicBrainzSpotifyTrack;

  constructor(private http:HttpClient) { }
  //constructor() { }

  ngOnInit() {
     this.http.get<Playlist[]>("http://localhost:5000/home/playlists").subscribe((data: Playlist[]) => this.playlists = data);
     this.playlistTracks = [];
  }

  onSelectPlaylist(id: string) {
    this.http.get<SpotifyTrack[]>("http://localhost:5000/home/playlists/" + id + "/tracks").subscribe((data: SpotifyTrack[]) => this.playlistTracks = data);
    var results = document.getElementById("results");
    var out: string = "<table class='result-table' style='font-size:14pt;color:white;align-self:center;'><tr><th>Title</th><th>Artists</th><th>Album</th></tr>";
    for (let track of this.playlistTracks) {
      out += "<tr><td>" + track.name + " </td><td> ";
      for (let artist of track.artists) {
        out += artist.name + ",";
      }
      out += "</td><td>" + track.album.name + "</td></tr>";
    }
    out += "</table>"
    results.innerHTML = out;
  }

  onSelectSong(id: string) {
    this.http.get<MusicBrainzSpotifyTrack>("http://localhost:5000/home/song/" + id).subscribe((data: MusicBrainzSpotifyTrack) => this.musicBrainzSpotifyTrack = data);
    var results = document.getElementById("results");
    var toggle = document.getElementById("toggle");
  }
  
}

//{this.http.get('http://localhost:5000/login')
//Get localhost:5000/home/search/<text>


$(function() {

    function search() {
		if(document.getElementById("searchInput") != null){
			alert((<HTMLInputElement>document.getElementById("searchInput")).value);
		}else {
			alert("Invalid credentials");
		}		
	}
	
    var searchButton = document.getElementById("searchButton");
    searchButton.addEventListener('click', search);
})