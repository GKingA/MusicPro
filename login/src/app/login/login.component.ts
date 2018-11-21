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
    constructor(){}
    
    ngOnInit() {}

}

$(function() {

    function login(callback) {
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
