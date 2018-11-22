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

    login() {
        location.href = "http://localhost:5000/login";
    }
}