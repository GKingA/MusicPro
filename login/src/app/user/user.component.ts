import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import {AppComponent} from '../app.component';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as $ from 'jquery';


interface Playlist {
  id: string;
  name:string;
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

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyTrackArtist[];
  album: SpotifyTrackAlbum;
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

  constructor(private http:HttpClient) { }
  //constructor() { }

  ngOnInit() {
     this.http.get<Playlist[]>("http://localhost:5000/home/playlists").subscribe((data: Playlist[]) => this.playlists = data);
  }

  onSelectPlaylist(id: string) {
    /*var playlistTracks: SpotifyTrack[];
    this.http.get<SpotifyTrack[]>("http://localhost:5000/home/playlists/"+id+"/tracks").subscribe((data: SpotifyTrack[]) => playlistTracks = data);
    alert(playlistTracks.length);
    document.getElementById("results");*/
    alert(id);
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
