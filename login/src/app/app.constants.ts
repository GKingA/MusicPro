import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public server = 'http://localhost:5000/';
    public apiUrl = 'api/';
    public serverWithApiUrl = this.server + this.apiUrl;
}