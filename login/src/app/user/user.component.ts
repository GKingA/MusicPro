import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import {AppComponent} from '../app.component';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';


export class Playlist {
  id: string;
  name:string;
  constructor( id: string, name: string ) { 
    this.id = id;
    this.name = name;
}
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
  //playlists$: Observable<Playlist[]>;
  playlists: Playlist[];
  //http: HttpClient;

  //constructor(private http:HttpClient) { }
  constructor() { }

  ngOnInit() {
    var playlists: Playlist[] = [
      {id: "123", name: "kiscica"},
      {id: "234", name: "kiskutya"},
      {id: "345", name: "kisnyuszi"}
    ];//this.http.get<Playlist[]>("http://localhost:5000/home/playlists");
    this.playlists = playlists;
  }

  onSelectPlaylist(id: string) {
    //this.http.get<Playlist[]>("http://localhost:5000/home/playlists/"+id+"/tracks");
    alert("meow");
  }

}

//{this.http.get('http://localhost:5000/login')

