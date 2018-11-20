import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import {AppComponent} from '../app.component';
import { NgModule } from '@angular/core';
import * as $ from 'jquery';

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

  constructor() { }

  ngOnInit() {
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
