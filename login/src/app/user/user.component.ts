import { Component, OnInit, HostListener } from '@angular/core';
import { Observable } from "rxjs";
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import {AppComponent} from '../app.component';
//import {ServiceModule} from '../service/service.module';
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
  searchResults: SpotifyTrack[];
  musicBrainzSpotifyTrack: MusicBrainzSpotifyTrack;

  constructor(private http:HttpClient) { 
    //document.getElementById("searchButton").addEventListener('click', this.search);
  }
  //constructor() { }

  ngOnInit() {
     this.http.get<Playlist[]>("http://localhost:5000/home/playlists").subscribe((data: Playlist[]) => this.playlists = data);
     this.playlistTracks = [];
	 this.searchResults=[];
  }

  showSpotifyTracks(tracks: SpotifyTrack[]) {
    var results = document.getElementById("results");
    var out: string = "<table class='result-table' style='font-size:14pt;color:white;align-self:center;'><tr><th>Title</th><th>Artists</th><th>Album</th></tr>";
    for (let track of tracks) {
      out += "<tr><td><a (click)=onSelectSong('"+track.id+"')>" + track.name + " </a></td><td> ";
      for (let artist of track.artists) {
        out += artist.name;
        if (track.artists.indexOf(artist) != track.artists.length - 1) {
          out += ", ";
        }
      }
      out += "</td><td>" + track.album.name + "</td></tr>";
    }

    out += "</table>"
    results.innerHTML = out;
  }

  onSelectPlaylist(id: string) {
    var observer = this.http.get<SpotifyTrack[]>("http://localhost:5000/home/playlists/" + id + "/tracks");
    observer.subscribe((data: SpotifyTrack[]) => {this.searchResults = data;});
  }

  onSelectSong(id: string) {
    this.http.get<MusicBrainzSpotifyTrack>("http://localhost:5000/home/song/" + id).subscribe((data: MusicBrainzSpotifyTrack) => this.musicBrainzSpotifyTrack = data);
    var results = document.getElementById("results");
    var toggle = document.getElementById("toggle");
	
	//searchResults
  }

  searchOnServer(text: string) {
    var observer = this.http.get<SpotifyTrack[]>("http://localhost:5000/home/search/" + text);
    observer.subscribe((data: SpotifyTrack[]) => {this.searchResults = data;});
  }

  search() {
		if(document.getElementById("searchInput") != null){
      this.searchOnServer((<HTMLInputElement>document.getElementById("searchInput")).value);
		}else {
			alert("Invalid credentials");
		}
	}
  
}