import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Configuration } from '../app.constants';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

@Injectable()
export class ServiceModule {

    private actionUrl: string;

    constructor(private http: HttpClient) {
        this.actionUrl = 'http://localhost:5000/home';
    }

    public getSearch<T>(text: string): Observable<T> {
        return this.http.get<T>(this.actionUrl+'/seach/'+text);
    }

    public getSong<T>(id: string): Observable<T> {
        return this.http.get<T>(this.actionUrl+'/song/'+id);
    }

    public getArtist<T>(id: string): Observable<T> {
        return this.http.get<T>(this.actionUrl+'/artist/'+id);
    }

    public getAlbum<T>(id: string): Observable<T> {
        return this.http.get<T>(this.actionUrl+'/album/'+id);
    }

    public getWork<T>(id: string): Observable<T> {
        return this.http.get<T>(this.actionUrl+'/work/'+id);
    }

    public getPlaylist<T>(): Observable<T> {
        return this.http.get<T>(this.actionUrl + '/playlists');
    }

    public getPlaylistTracks<T>(id: string): Observable<T> {
        return this.http.get<T>(this.actionUrl + '/playlists/' + id + '/tracks');
    }

    public addNewPlaylist<T>(text: string): Observable<T> {
        return this.http.get<T>(this.actionUrl + '/playlists/' + text);
    }

    public addSongToPlaylist<T>(playlistId: string, trackId: string): Observable<T> {
        return this.http.get<T>(this.actionUrl + '/playlists/' + playlistId + '/add/' + trackId);
    }
}


@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        return next.handle(req);
    }
}