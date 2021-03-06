import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CustomMaterialModule } from './core/material.module';
import { AppRoutingModule } from './core/app.routing.module';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ServiceModule } from './service/service.module';
import {MatSelectModule} from '@angular/material';
import {Http, HttpModule} from '@angular/http';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatDialogModule} from '@angular/material';
import { DialogPlaylistComponent } from './dialog-playlist/dialog-playlist.component';
import { TrackDataComponent } from './track-data/track-data.component';
import { DialogAddToPlaylistComponent } from './dialog-add-to-playlist/dialog-add-to-playlist.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    DialogPlaylistComponent,
    TrackDataComponent,
    DialogAddToPlaylistComponent//,
	  //ServiceModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    MatDialogModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ DialogPlaylistComponent, DialogAddToPlaylistComponent ]
})
export class AppModule { }