import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import {Http, HttpModule} from '@angular/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AppComponent} from '../app.component';
//import { ServiceModule } from '../service/service.module';
import * as Handlebars from '../../../bower_components/handlebars/handlebars';

@NgModule({
    imports: [ BrowserModule, HttpModule ],
    providers: [],
    declarations: [ AppComponent ],
    bootstrap: [ AppComponent ]
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  //constructor(private serviceModule: ServiceModule) {}
  //constructor(private http: Http)
	//constructor(public http: Http) {this.http.get('http://localhost:5000/login');}
	constructor(){}
	//constructor(private http: Http){this.http.get('http://localhost:5000/login');}

  ngOnInit() {
  }

}

$(function() {

    function login(callback) {
        //var CLIENT_ID = '6b284830006843e7ae7b170725715aed';
        //var REDIRECT_URI = 'http://jmperezperez.com/spotify-oauth-jsfiddle-proxy/';
		
		var SPOTIPY_CLIENT_ID = '942bf8f4d9ad47379fa90fd43b81afd7';
		var CLIENT_ID = '90f01df0bd6241f69580dc7ebcc8e8a1';
		var REDIRECT_URI = 'http://localhost:5000/home';
		
        function getLoginURL(scopes) {
            return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
              '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
              '&scope=' + encodeURIComponent(scopes.join(' ')) +
              '&response_type=token';
        }
        
        var url = getLoginURL([
            'user-read-email'
        ]);

        var width = 450,
            height = 730,
            left = (screen.width / 2) - (width / 2),
            top = (screen.height / 2) - (height / 2);
    
        window.addEventListener("message", function(event) {
            var hash = JSON.parse(event.data);
            if (hash.type == 'access_token') {
                callback(hash.access_token);
            }
        }, false);
		
		
        
        location.href = "http://localhost:5000/login";
        
    }

    function getUserData(accessToken) {
        return $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
               'Authorization': 'Bearer ' + accessToken
            }
        });
    }
	
    var resultsPlaceholder = document.getElementById('result');
    var loginButton = document.getElementById('btn-login');
    
	var template;
	
	
    loginButton.addEventListener('click', function() {
		
        login(function(accessToken) {
            getUserData(accessToken)
                .then(function(response) {
                    loginButton.style.display = 'none';
					template = Handlebars.compile(document.getElementById('result-template').innerHTML)
                    resultsPlaceholder.innerHTML = template(response);
                });
            });
        
    });
	/////this.router.navigate(["user"]);////
})
