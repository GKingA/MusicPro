import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
//import { ServiceModule } from '../service/service.module';
import * as Handlebars from '../../../bower_components/handlebars/handlebars';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  //constructor(private serviceModule: ServiceModule) {}
  //constructor(private http: Http)
	constructor() {}

  ngOnInit() {
  }

}

$(function() {

    function login(callback) {
        
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
