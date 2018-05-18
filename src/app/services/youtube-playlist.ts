import { Playlist } from './../models/playlist';
import { Injectable } from '@angular/core';
import { Response, RequestOptions, Headers, Http  } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpUtilService } from './http-util-service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

// // Operators
// 
// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/toPromise';




@Injectable()
export class YoutubePlaylist {

    key = 'AIzaSyDd4r3f_vAjThZY2Xl3USYWJlnP0FiaDRk';

    constructor(private http: Http, private httpUtil: HttpUtilService) {}

    getplaylist(playlistId): Observable<Playlist> {

        return this.http.get(this.httpUtil.url("part=snippet&playlistId="+playlistId+"&key="+this.key+"&maxResults=10"),
            this.httpUtil.headers())
            .map(this.httpUtil.extrairDados)
            .catch(this.httpUtil.processarErros);
    }


    playlistList_page(playlistId, pageToken){

          return this.http.get(this.httpUtil.url("part=snippet&pageToken="+pageToken+"&playlistId="+playlistId+"&key="+this.key+"&maxResults=10"),
            this.httpUtil.headers())
            .map(this.httpUtil.extrairDados)
            .catch(this.httpUtil.processarErros);

       // return this.http.get("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&pageToken="+pageToken+"&playlistId="+playlistId+"&key="+this.key)
  }

}